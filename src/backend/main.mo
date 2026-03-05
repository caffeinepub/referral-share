import Map "mo:core/Map";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type ReferralCode = Text;

  public type UserProfile = {
    referralCode : ReferralCode;
    referralCount : Nat;
    joinTime : Time.Time;
  };

  module UserProfile {
    public func compareByReferrals(profile1 : UserProfile, profile2 : UserProfile) : Order.Order {
      Nat.compare(profile2.referralCount, profile1.referralCount);
    };
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let referralCodes = Map.empty<ReferralCode, Principal>();

  // Initialize the access control state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Register new user with optional referral code
  // Open to all users including guests/anonymous
  public shared ({ caller }) func register(referralCode : ?ReferralCode) : async () {
    if (isRegisteredInternal(caller)) { return };

    let newCode = generateReferralCode(caller);
    let newProfile = {
      referralCode = newCode;
      referralCount = 0;
      joinTime = Time.now();
    };

    userProfiles.add(caller, newProfile);
    referralCodes.add(newCode, caller);

    // Assign user role to the newly registered user
    AccessControl.assignRole(accessControlState, caller, caller, #user);

    switch (referralCode) {
      case (null) {}; // No referral
      case (?refCode) {
        switch (referralCodes.get(refCode)) {
          case (null) {};
          case (?referrerId) {
            updateReferralCount(referrerId);
          };
        };
      };
    };
  };

  // Only registered users can get their profile
  public query ({ caller }) func getMyProfile() : async UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can view their profile");
    };

    switch (userProfiles.get(caller)) {
      case (?profile) { profile };
      case (null) { Runtime.trap("User not found") };
    };
  };

  // Anyone can check if they are registered
  public query ({ caller }) func isRegistered() : async Bool {
    isRegisteredInternal(caller);
  };

  func isRegisteredInternal(caller : Principal) : Bool {
    userProfiles.containsKey(caller);
  };

  // Public leaderboard - accessible to all
  public query ({ caller }) func getLeaderboard() : async [UserProfile] {
    let profilesArray = userProfiles.values().toArray();
    let sorted = profilesArray.sort(UserProfile.compareByReferrals);

    let maxLength = if (sorted.size() > 10) { 10 } else {
      sorted.size();
    };

    sorted.sliceToArray(0, maxLength);
  };

  // Required by frontend - get caller's profile
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can view profiles");
    };
    userProfiles.get(caller);
  };

  // Required by frontend - get another user's profile
  public query ({ caller }) func getUserProfile(user: Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Required by frontend - save caller's profile
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  func generateReferralCode(caller : Principal) : ReferralCode {
    let timestamp = Time.now().toText();
    caller.toText() # "_" # timestamp;
  };

  func updateReferralCount(user : Principal) {
    switch (userProfiles.get(user)) {
      case (?profile) {
        let updatedProfile = {
          referralCode = profile.referralCode;
          referralCount = profile.referralCount + 1;
          joinTime = profile.joinTime;
        };
        userProfiles.add(user, updatedProfile);
      };
      case (null) {};
    };
  };
};
