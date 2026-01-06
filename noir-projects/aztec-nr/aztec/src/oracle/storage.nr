use protocol_types::{
    abis::block_header::BlockHeader,
    address::AztecAddress,
    traits::{Hash, Packable, ToField},
};

#[oracle(utilityStorageRead)]
unconstrained fn storage_read_oracle<let N: u32>(
    address: Field,
    storage_slot: Field,
    block_hash: Field,
    length: u32,
) -> [Field; N] {}

pub unconstrained fn raw_storage_read<let N: u32>(
    address: AztecAddress,
    storage_slot: Field,
    block_hash: Field,
) -> [Field; N] {
    storage_read_oracle(address.to_field(), storage_slot, block_hash, N)
}

pub unconstrained fn storage_read<T>(
    address: AztecAddress,
    storage_slot: Field,
    block_header: BlockHeader,
) -> T
where
    T: Packable,
{
    let block_hash = block_header.hash();
    T::unpack(raw_storage_read(address, storage_slot, block_hash))
}
