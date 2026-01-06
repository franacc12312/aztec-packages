import { z } from 'zod';

import { schemas } from '../schemas/schemas.js';

export const BlockHashParameterSchema = z.union([schemas.Fr, z.literal('latest')]);

/** Block hash parameter - either a specific block hash (Fr) or 'latest' */
export type BlockHashParameter = z.infer<typeof BlockHashParameterSchema>;
