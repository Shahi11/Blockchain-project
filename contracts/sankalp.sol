//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;


interface Fitcoin {
    function balanceOf(address tokenOwner) external view returns (uint);
    function transferFrom(address owner, address buyer, uint numTokens, address contractAdd) external returns (bool);
    function approve(address delegate, uint numTokens, address sender) external returns (bool);
    function allowance(address owner, address contractAdd) external view returns (uint);
    function transfer(address receiver, uint numTokens, address sender) external returns (bool);
}

contract Sankalp {
    // storing the address of the admin
    address admin;
   
//  custom data type for all people registering
    struct user{
        string name;
        uint balance;
        uint memberType;
        uint rating;
        uint supscriptionCount;
    }

//  custom data structure for workout details
    struct workoutPackage{
        string uid;
        string packageName;
        string description;
        string bodyType;
        string diet;
        string reps;
        uint  sellCost;
        uint rentCost;
        uint UserRating;
        bool deleted;
    }

// storing the mapping of address to user
   mapping(address => user) users;
// storing the mapping of package id to address of the owner
   mapping(string => address) owners ;
// storing the mapping of the package id to workout details
   mapping(string => workoutPackage) workoutPackageMapping;
   workoutPackage[] listOfWorkouts;
  
   event Transfer(address indexed from, address indexed to, uint cost);

   address public constant contract_Add = 0x7FB5d1FcD51FE40dE06951d700A9f109671990b0;
   Fitcoin fc = Fitcoin(contract_Add);

// checks if initial balance id greater than 0
    modifier isBalancePresent(){
        require(msg.value > 0,"Minimum balance should be more than 0");
        _;
    }

// checks if a specific user is eligible to access a particular function or not
    modifier isEligible(uint member){
        require(users[msg.sender].memberType == member);
        _;
    }

// registers the chairperson and assigns memberType = 1
   constructor() payable {  
       admin = msg.sender;
       users[msg.sender].balance = msg.value;
       users[msg.sender].memberType = 1;
    }  


// register the user with their details
    function registerUser(uint memberType, string memory name) public payable {  

       //fc.transferFrom(admin,msg.sender, 250,contractAdd);
       users[msg.sender].memberType = memberType;
       users[msg.sender].name = name;
       users[msg.sender].rating = 0;
    }  
    
    function getAllWorkouts() view public returns(workoutPackage[] memory){
       return listOfWorkouts;
    }

    function getOwner(string memory id) view public returns(user memory){
       return users[owners[id]];
    }

    function getUser() view public returns(user memory){
       return users[msg.sender];
    }

    function getBalance() view public returns(uint256){
       return fc.balanceOf(msg.sender);
    }

    function checkOwner() view public returns(bool){
       return msg.sender == admin;
    }

    function airDrop(address receiver, uint amount) payable public{
        fc.transfer(receiver, amount, admin);
    }

    function approval(uint approvedAmt) public{
        fc.approve(address(this), approvedAmt, msg.sender);
    }

    function checkAllowance() view public returns(uint){
        return fc.allowance(msg.sender, address(this));
    }

// Add workout details to the blockchain
    function addWorkoutPackage(string memory uid, string memory packageName,string memory description, string memory bodyType, string memory diet, string memory reps, uint sellCost, uint rentCost) isEligible(1) payable public {
        // integrity checks
        require(bytes(uid).length > 0, "Unique id needed to register workout");
        require(bytes(diet).length > 0, "Diet needed to register workout");
        require(bytes(reps).length > 0, "Reps needed to register workout");
        require(bytes(bodyType).length > 0, "Body Type needed to register workout");
        owners[uid] = msg.sender;
        // maps the data onto our structure
        workoutPackageMapping[uid] = workoutPackage(uid, packageName,description,bodyType, diet, reps, sellCost, rentCost, users[msg.sender].rating, false);

        listOfWorkouts.push(workoutPackage(uid, packageName,description, bodyType, diet, reps, sellCost, rentCost,users[msg.sender].rating, false));
    }

//  Assigns rating to a particular program
    function modifyRating(uint rating, string memory uid) public isEligible(2) isEligible(1){
        users[owners[uid]].supscriptionCount += 1;
        users[owners[uid]].rating = rating;

        workoutPackageMapping[uid].UserRating = users[owners[uid]].rating;
            for (uint i = 0; i < listOfWorkouts.length; i ++ ){
                if (keccak256(bytes(listOfWorkouts[i].uid)) == keccak256(bytes(uid))){
                listOfWorkouts[i].UserRating = users[owners[uid]].rating;
                break;
            }
        }
    }

    // transfers the owneship of the already bought package
    function ownershipTransfer(string memory uid, bool isBuy) public payable returns (uint){
  
        address payable seller = payable(owners[uid]);
       
        // if the user has bought the program
        if(isBuy){
            owners[uid] = msg.sender;
            require(fc.balanceOf(msg.sender)>= workoutPackageMapping[uid].sellCost,"Insufficient Balance");
            // transfer of balances
             fc.transferFrom(msg.sender,seller, workoutPackageMapping[uid].sellCost, address(this));
        }
       // if the user has subscribed to the program 
        else{
            require(fc.balanceOf(msg.sender) >= workoutPackageMapping[uid].rentCost,"Insufficient Balance");
            fc.transferFrom(msg.sender,seller, workoutPackageMapping[uid].rentCost, address(this));
        
        }
       
        return msg.sender.balance;  
    }
}