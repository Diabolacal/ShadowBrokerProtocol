#[test_only]
module shadow_broker::shadow_broker_tests;

    use sui::test_scenario as ts;
    use sui::coin;
    use sui::sui::SUI;
    use shadow_broker::intel_object;
    use shadow_broker::marketplace;
    use std::string;

    const SELLER: address = @0xA;
    const BUYER: address = @0xB;

    #[test]
    fun test_mint_intel_object() {
        let mut scenario = ts::begin(SELLER);
        {
            let intel = intel_object::mint(
                string::utf8(b"blob123"),
                vector[],
                string::utf8(b"audio/wav"),
                120,
                1024000,
                string::utf8(b"Fleet intel from J-1234"),
                option::some(string::utf8(b"teaser456")),
                scenario.ctx(),
            );
            assert!(intel.duration_seconds() == 120);
            assert!(intel.file_size_bytes() == 1024000);
            assert!(intel.creator() == SELLER);
            assert!(intel.encrypted_key().is_empty());
            assert!(intel.teaser_blob_id().is_some());
            transfer::public_transfer(intel, SELLER);
        };
        scenario.end();
    }

    #[test]
    fun test_update_encrypted_key() {
        let mut scenario = ts::begin(SELLER);
        {
            let intel = intel_object::mint(
                string::utf8(b"blob123"),
                vector[],
                string::utf8(b"audio/wav"),
                60,
                512000,
                string::utf8(b"Test intel"),
                option::none(),
                scenario.ctx(),
            );
            transfer::public_transfer(intel, SELLER);
        };
        scenario.next_tx(SELLER);
        {
            let mut intel = scenario.take_from_sender<intel_object::IntelObject>();
            intel.update_encrypted_key(vector[1, 2, 3, 4], scenario.ctx());
            assert!(*intel.encrypted_key() == vector[1, 2, 3, 4]);
            transfer::public_transfer(intel, SELLER);
        };
        scenario.end();
    }

    #[test]
    #[expected_failure(abort_code = intel_object::EKeyAlreadySet)]
    fun test_update_key_twice_fails() {
        let mut scenario = ts::begin(SELLER);
        {
            let intel = intel_object::mint(
                string::utf8(b"blob123"),
                vector[1, 2, 3],
                string::utf8(b"audio/wav"),
                60,
                512000,
                string::utf8(b"Test intel"),
                option::none(),
                scenario.ctx(),
            );
            transfer::public_transfer(intel, SELLER);
        };
        scenario.next_tx(SELLER);
        {
            let mut intel = scenario.take_from_sender<intel_object::IntelObject>();
            intel.update_encrypted_key(vector[5, 6, 7], scenario.ctx());
            transfer::public_transfer(intel, SELLER);
        };
        scenario.end();
    }

    #[test]
    #[expected_failure(abort_code = intel_object::ENotOwner)]
    fun test_update_key_not_owner_fails() {
        let mut scenario = ts::begin(SELLER);
        {
            let intel = intel_object::mint(
                string::utf8(b"blob123"),
                vector[],
                string::utf8(b"audio/wav"),
                60,
                512000,
                string::utf8(b"Test intel"),
                option::none(),
                scenario.ctx(),
            );
            transfer::public_transfer(intel, BUYER);
        };
        scenario.next_tx(BUYER);
        {
            let mut intel = scenario.take_from_sender<intel_object::IntelObject>();
            intel.update_encrypted_key(vector[1, 2, 3], scenario.ctx());
            transfer::public_transfer(intel, BUYER);
        };
        scenario.end();
    }

    #[test]
    fun test_list_and_purchase() {
        let mut scenario = ts::begin(SELLER);
        {
            let mut intel = intel_object::mint(
                string::utf8(b"blob123"),
                vector[],
                string::utf8(b"audio/wav"),
                60,
                512000,
                string::utf8(b"Fleet movements"),
                option::some(string::utf8(b"teaser789")),
                scenario.ctx(),
            );
            intel.update_encrypted_key(vector[10, 20, 30], scenario.ctx());
            marketplace::list(intel, 1_000_000, scenario.ctx());
        };
        scenario.next_tx(BUYER);
        {
            let mut listing = scenario.take_shared<marketplace::Listing>();
            assert!(listing.price() == 1_000_000);
            assert!(listing.seller() == SELLER);
            assert!(listing.has_intel());

            let payment = coin::mint_for_testing<SUI>(1_000_000, scenario.ctx());
            let intel = marketplace::purchase(&mut listing, payment, scenario.ctx());
            assert!(*intel.encrypted_key() == vector[10, 20, 30]);
            assert!(!listing.has_intel());

            transfer::public_transfer(intel, BUYER);
            ts::return_shared(listing);
        };
        scenario.end();
    }

    #[test]
    #[expected_failure(abort_code = marketplace::EWrongPayment)]
    fun test_purchase_wrong_payment_fails() {
        let mut scenario = ts::begin(SELLER);
        {
            let intel = intel_object::mint(
                string::utf8(b"blob123"),
                vector[1, 2, 3],
                string::utf8(b"audio/wav"),
                60,
                512000,
                string::utf8(b"Test"),
                option::none(),
                scenario.ctx(),
            );
            marketplace::list(intel, 1_000_000, scenario.ctx());
        };
        scenario.next_tx(BUYER);
        {
            let mut listing = scenario.take_shared<marketplace::Listing>();
            let payment = coin::mint_for_testing<SUI>(500_000, scenario.ctx());
            let intel = marketplace::purchase(&mut listing, payment, scenario.ctx());
            transfer::public_transfer(intel, BUYER);
            ts::return_shared(listing);
        };
        scenario.end();
    }

    #[test]
    fun test_delist() {
        let mut scenario = ts::begin(SELLER);
        {
            let intel = intel_object::mint(
                string::utf8(b"blob123"),
                vector[1, 2, 3],
                string::utf8(b"audio/wav"),
                60,
                512000,
                string::utf8(b"Test"),
                option::none(),
                scenario.ctx(),
            );
            marketplace::list(intel, 1_000_000, scenario.ctx());
        };
        scenario.next_tx(SELLER);
        {
            let mut listing = scenario.take_shared<marketplace::Listing>();
            let intel = marketplace::delist(&mut listing, scenario.ctx());
            transfer::public_transfer(intel, SELLER);
            ts::return_shared(listing);
        };
        scenario.end();
    }

    #[test]
    #[expected_failure(abort_code = marketplace::ENotSeller)]
    fun test_delist_not_seller_fails() {
        let mut scenario = ts::begin(SELLER);
        {
            let intel = intel_object::mint(
                string::utf8(b"blob123"),
                vector[1, 2, 3],
                string::utf8(b"audio/wav"),
                60,
                512000,
                string::utf8(b"Test"),
                option::none(),
                scenario.ctx(),
            );
            marketplace::list(intel, 1_000_000, scenario.ctx());
        };
        scenario.next_tx(BUYER);
        {
            let mut listing = scenario.take_shared<marketplace::Listing>();
            let intel = marketplace::delist(&mut listing, scenario.ctx());
            transfer::public_transfer(intel, BUYER);
            ts::return_shared(listing);
        };
        scenario.end();
    }
