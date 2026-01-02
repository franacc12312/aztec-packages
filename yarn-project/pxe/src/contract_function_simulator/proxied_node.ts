import { Timer } from '@aztec/foundation/timer';
import type { AztecNode } from '@aztec/stdlib/interfaces/client';
import type { NodeStats, RoundTripStats } from '@aztec/stdlib/tx';

/*
 * Proxy generator for an AztecNode that tracks the time taken for each RPC call
 * and the number of round trips (actual blocking waits for node responses).
 *
 * A round trip is counted when we transition from 0 to 1 in-flight calls,
 * and ends when all concurrent calls complete. This means parallel calls
 * in Promise.all count as a single round trip.
 */
export type ProxiedNode = AztecNode & { getStats(): NodeStats };

export class ProxiedNodeFactory {
  static create(node: AztecNode): ProxiedNode {
    // Per-method call stats
    const perMethod: Partial<Record<keyof AztecNode, { times: number[] }>> = {};

    // Round trip tracking
    let inFlightCount = 0;
    let currentRoundTripTimer: Timer | null = null;
    const roundTrips: RoundTripStats = {
      roundTrips: 0,
      totalBlockingTime: 0,
      roundTripDurations: [],
    };

    return new Proxy(node, {
      get(target, prop: keyof ProxiedNode) {
        if (prop === 'getStats') {
          return (): NodeStats => {
            return { perMethod, roundTrips };
          };
        } else {
          return async function (...args: any[]) {
            // Track per-method stats
            if (!perMethod[prop]) {
              perMethod[prop] = { times: [] };
            }

            // Start of a new round trip batch?
            if (inFlightCount === 0) {
              roundTrips.roundTrips++;
              currentRoundTripTimer = new Timer();
            }
            inFlightCount++;

            const callTimer = new Timer();
            try {
              const result = await (target[prop] as any).apply(target, args);
              return result;
            } finally {
              const callTime = callTimer.ms();
              perMethod[prop].times.push(callTime);

              inFlightCount--;

              // End of round trip batch - all concurrent calls completed
              if (inFlightCount === 0 && currentRoundTripTimer) {
                const roundTripTime = currentRoundTripTimer.ms();
                roundTrips.totalBlockingTime += roundTripTime;
                roundTrips.roundTripDurations.push(roundTripTime);
                currentRoundTripTimer = null;
              }
            }
          };
        }
      },
    }) as ProxiedNode;
  }
}
