//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;



contract Sankalp {

    address admin;

    struct user{
        string name;
        uint balance;
        uint memberType;
        uint rating;
        uint supscriptionCount;
    }


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

   mapping(address => user) users;
   mapping(string => address) owners ;
   mapping(string => workoutPackage) workoutPackageMapping;
   workoutPackage[] listOfWorkouts;
  
   event Transfer(address indexed from, address indexed to, uint cost);


    modifier isBalancePresent(){
        require(msg.value > 0,"Minimum balance should be more than 0");
        _;
    }

    modifier isEligible(uint member){
        require(users[msg.sender].memberType == member);
        _;
    }

   constructor() payable {  
       admin = msg.sender;
       users[msg.sender].balance = msg.value;
       users[msg.sender].memberType = 3;
    }  


    function registerUser(uint memberType, string memory name) isBalancePresent public payable {  
       users[msg.sender].balance = msg.value;
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


    function addWorkoutPackage(string memory uid, string memory packageName,string memory description, string memory bodyType, string memory diet, string memory reps, uint sellCost, uint rentCost) isEligible(1) payable public {
        require(bytes(uid).length > 0, "Unique id needed to register workout");
        require(bytes(diet).length > 0, "Diet needed to register workout");
        require(bytes(reps).length > 0, "Reps needed to register workout");
        require(bytes(bodyType).length > 0, "Body Type needed to register workout");
        owners[uid] = msg.sender;
        workoutPackageMapping[uid] = workoutPackage(uid, packageName,description,bodyType, diet, reps, sellCost, rentCost, users[msg.sender].rating, false);

        listOfWorkouts.push(workoutPackage(uid, packageName,description, bodyType, diet, reps, sellCost, rentCost,users[msg.sender].rating, false));
    }

    function modifyRating(uint rating, string memory uid) public isEligible(2){
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

    function ownershipTransfer(string memory uid, bool isBuy) public payable returns (uint){
  
        address payable seller = payable(owners[uid]);
       
        
        if(isBuy){
            owners[uid] = msg.sender;
            require(users[msg.sender].balance >= workoutPackageMapping[uid].sellCost,"Insufficient Balance");
            users[seller].balance += workoutPackageMapping[uid].sellCost;
            users[msg.sender].balance -= workoutPackageMapping[uid].sellCost;
        
             emit Transfer(msg.sender, seller, workoutPackageMapping[uid].sellCost);

        //     for (uint i = 0; i < listOfWorkouts.length; i ++ ){
        //         if (keccak256(bytes(listOfWorkouts[i].uid)) == keccak256(bytes(uid))){
        //         delete listOfWorkouts[i];
        //         break;
        //     }
        //   } 
        }

        else{
            require(users[msg.sender].balance >= workoutPackageMapping[uid].rentCost,"Insufficient Balance");
            users[seller].balance += workoutPackageMapping[uid].rentCost;
            users[msg.sender].balance -= workoutPackageMapping[uid].rentCost;
             emit Transfer(msg.sender, seller, workoutPackageMapping[uid].rentCost);
        
        }
       
        return msg.sender.balance;  
    }
}