/// Marketplace — Listing and atomic purchase logic for Shadow Broker intel.
///
/// Sellers list IntelObjects at a fixed SUI price. Buyers purchase in a single PTB
/// that transfers payment and grants Seal decryption access atomically.
///
/// Key design decisions:
/// - Listing is a shared object so any buyer can purchase
/// - Purchase is atomic: payment + access grant in one transaction
/// - Revenue goes directly to seller address (no escrow)
module shadow_broker::marketplace {
    // === Errors ===

    // === Structs ===

    // === Events ===

    // === Public Entry Functions ===

    // === View Functions ===

    // === Package Functions ===
}
