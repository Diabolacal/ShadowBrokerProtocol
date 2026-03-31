/// Marketplace — Listing and atomic purchase logic for Shadow Broker intel.
///
/// Sellers list IntelObjects at a price in base units. Buyers purchase atomically
/// using Coin<T> where T is the settlement token (EVE on Frontier, SUI on testnet).
/// Listing is a shared object so any buyer can access it.
module shadow_broker::marketplace;

use sui::coin::Coin;
use sui::event;
use shadow_broker::intel_object::IntelObject;

// === Errors ===

#[error]
const EWrongPayment: vector<u8> = b"Payment does not match listing price";

#[error]
const ENotSeller: vector<u8> = b"Only the seller can delist";

#[error]
const EAlreadySold: vector<u8> = b"Listing has already been sold";

// === Structs ===

/// A marketplace listing wrapping an IntelObject. Shared object.
public struct Listing has key {
    id: UID,
    intel: Option<IntelObject>,
    price: u64,
    seller: address,
}

// === Events ===

public struct ListingCreatedEvent has copy, drop {
    listing_id: address,
    seller: address,
    price: u64,
}

public struct PurchaseEvent has copy, drop {
    listing_id: address,
    buyer: address,
    seller: address,
    price: u64,
}

// === Public Functions ===

/// Seller lists an IntelObject for sale. Creates a shared Listing.
public fun list(
    intel: IntelObject,
    price: u64,
    ctx: &mut TxContext,
) {
    let seller = ctx.sender();
    let listing = Listing {
        id: object::new(ctx),
        intel: option::some(intel),
        price,
        seller,
    };
    event::emit(ListingCreatedEvent {
        listing_id: listing.id.to_address(),
        seller,
        price,
    });
    transfer::share_object(listing);
}

/// Buyer purchases a listing. Atomic: coin to seller, IntelObject to buyer.
/// Generic over T: use Coin<SUI> on testnet, Coin<EVE> on EVE Frontier.
public fun purchase<T>(
    listing: &mut Listing,
    payment: Coin<T>,
    ctx: &mut TxContext,
): IntelObject {
    assert!(listing.intel.is_some(), EAlreadySold);
    assert!(payment.value() == listing.price, EWrongPayment);
    transfer::public_transfer(payment, listing.seller);
    event::emit(PurchaseEvent {
        listing_id: listing.id.to_address(),
        buyer: ctx.sender(),
        seller: listing.seller,
        price: listing.price,
    });
    listing.intel.extract()
}

/// Seller reclaims an unsold IntelObject.
public fun delist(
    listing: &mut Listing,
    ctx: &TxContext,
): IntelObject {
    assert!(ctx.sender() == listing.seller, ENotSeller);
    assert!(listing.intel.is_some(), EAlreadySold);
    listing.intel.extract()
}

// === View Functions ===

public fun price(self: &Listing): u64 { self.price }
public fun seller(self: &Listing): address { self.seller }
public fun has_intel(self: &Listing): bool { self.intel.is_some() }
