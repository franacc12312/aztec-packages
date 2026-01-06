import { BlockNumberSchema } from '@aztec/foundation/branded-types';

import { z } from 'zod';

import { schemas } from '../schemas/schemas.js';

export const BlockParameterSchema = z.union([BlockNumberSchema, schemas.Fr, z.literal('latest')]);

/** Block parameter - either a specific BlockNumber, block hash (Fr), or 'latest' */
export type BlockParameter = z.infer<typeof BlockParameterSchema>;
