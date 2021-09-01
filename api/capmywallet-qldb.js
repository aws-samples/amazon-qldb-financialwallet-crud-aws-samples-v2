/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
  
//Build a simple CRUD operation & Data streams on Amazon QLDB using AWS Lambda, API Gateway, Amazon DynamoDB, Amazon Kinesis Data streams

// INITIAL LOADS

'use strict';
var qldb = require("amazon-qldb-driver-nodejs");
var AWS = require("aws-sdk");
var myConfig = new AWS.Config();
myConfig.update({ region: "us-east-1" });

// INITIAL LOADS ABOVE

//------------------------------------------------------------------------------
//QLDB Table create

module.exports.qldb = function (event, context, callback) {
      const msgparse = JSON.parse(event.body);
      var tablename = "wallettable";
      //qldb code starts from here
       console.log('QLDB function ' + tablename);
    const driver = new qldb.QldbDriver("captable1", myConfig);
    driver
    .executeLambda(async (txn) => {
      txn.execute(`CREATE TABLE ${tablename}`);
      })
    .then(() => {
     });
    driver.close();
    
   
    //qldb code ends here
  // This is the response back as JSON
  const response = {
    statusCode: 201,
   body: JSON.stringify({message: `Created ${tablename} in QLDB success`, 
                      statuscode: 201,
                      status: `${tablename} table created`,
                      author: "Protected code owner- "
   }),
  };

  callback(null, response);
};
//QLDB Table create END
//------------------------------------------------------------------------------




//------------------------------------------------------------------------------
//QLDB create Account in the wallet and userprofile START -----
module.exports.qldbcreateaccount = function (event, context, callback) {
      const msgparse = JSON.parse(event.body);
      var email= msgparse.email;
      console.log('QLDB create account function ' + email);
      const record = JSON.stringify({email: msgparse.email, username: msgparse.username, CurrentBalance: 0, PreviousBalance: 0});
  //qldb code starts from here
   const driver = new qldb.QldbDriver("captable1", myConfig);
   
   //check for account wallet exisits or not START
   driver
    .executeLambda(async (txn) => {
      return txn.execute(
        "select email from wallettable WHERE email = ?",
        email
      );
    })
    .then((result) => {
      const resultList = result.getResultList();
      if (resultList.length === 0) 
      { 
        console.log("Array is empty! Account can be created") ;
        driver
    .executeLambda((txn) => {
      txn.execute("INSERT INTO wallettable ?", JSON.parse(record));
    })
    .then(() => {
      console.log("New Account wallet created successfully for " + email);
      
    })
    .then((result) => {
      driver.close();
    });
    // User profile creation in DynamoDB START
    var docClient = new AWS.DynamoDB.DocumentClient();
    var table = "captable1";
    var ddbemail = msgparse.email;
    var ddbusername = msgparse.username;
    
    var params = {
    TableName:table,
    Item:{
        "email": ddbemail,
        "username": ddbusername
        }
    };
      console.log("Adding a new userprofile in DynamoDB...");
      docClient.put(params, function(err, data) {
    if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        console.log("Account creation failed for " + email + ". Account already exists");
      const response = {
        statusCode: 200,
        body: JSON.stringify({message: "Account creation failed in Userprofile DB", 
                      statuscode: 200,
                      status: "Account creation Unsuccess",
                      author: 'Protected code owner- '
   }),
  };

  callback(null, response);  
    } else {
        console.log("Added item:", JSON.stringify(data, null, 2));
        const response = {
        statusCode: 201,
        body: JSON.stringify({message: `New wallet and userprofile for ${email} created success`, 
                      statuscode: 201,
                      status: `${email} account added`,
                      CurrentBalance: 0,
                      PreviousBalance: 0,
                      author: 'Protected code owner- '
   }),
  };

  callback(null, response);
    }
    });
    //User profile creation in DynamoDB end
    
    
   // This is the response back as JSON
  
      } else {
      console.log("Account creation failed for " + email + ". Account already exists");
      const response = {
        statusCode: 200,
        body: JSON.stringify({message: "Account creation failed", 
                      statuscode: 200,
                      status: "Account creation Unsuccess. Account exists",
                      author: 'Protected code owner- '
   }),
  };

  callback(null, response);  
      }
      //Pretty print the result list
    
     })
    .then((result) => {
      driver.close();
    });
  
   // check for account wallet exists or not END
  
};
//QLDB create Account in the wallet and userprofile END -----
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// INDEX FUNCTION START
module.exports.index = function (event, context, callback) {
   
      var tablename = "wallettable";
      //qldb code starts from here
       console.log('QLDB indexing ' + tablename);
    const driver = new qldb.QldbDriver("captable1", myConfig);
    driver
    .executeLambda(async (txn) => {
        txn.execute(`CREATE INDEX ON ${tablename} (email)`);
      })
    .then(() => {
      driver.close();
      });
    
    //qldb code ends here
  // This is the response back as JSON
  const response = {
    statusCode: 201,
   body: JSON.stringify({message: `Initiated index creation in QLDB table`, 
                      statuscode: 201,
                      author: "Protected code owner- "
   }),
  };

  callback(null, response);

};

//INIT FUNCTION END




//------------------------------------------------------------------------------
// QLDB CHECK FUNDS START
module.exports.qldbgetfunds = function (event, context, callback) {
  const msgparse = JSON.parse(event.body);
  console.log('QLDB getfunds function  ' + msgparse.email);
  
  
  //qldb getfunds code START ----
  const driver = new qldb.QldbDriver("captable1", myConfig);
  const email = msgparse.email;
  driver
    .executeLambda(async (txn) => {
      return txn.execute(
        "select email, username, CurrentBalance, PreviousBalance from wallettable WHERE email = ?",
        email
      );
    })
    .then((result) => {
      const resultList = result.getResultList();
      //Pretty print the result list
      console.log("The result List is ", JSON.stringify(resultList, null, 2));
     
     // This is the response back as JSON
      const response = {
      statusCode: 200,
      body: JSON.stringify(resultList, null, 2),
      };

  callback(null, response);
    })
    .then((result) => {
      driver.close();
    });
  
  
  
// QLD GET FUNDS END
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// QLDB ADD FUNDS START
module.exports.qldbaddfunds = function (event, context, callback) {
   const msgparse = JSON.parse(event.body);
    console.log('QLDBaddfunds function  ' + msgparse.email + " amount " + msgparse.AddFunds);
  
    //qldb addfunds code START ----
  const driver = new qldb.QldbDriver("captable1", myConfig);
  const email = msgparse.email;
  var amounttoadd = msgparse.AddFunds;
  
  driver
    .executeLambda(async (txn) => {
      return txn.execute(
        "select email, CurrentBalance, PreviousBalance from wallettable WHERE email = ?",
        email
      );
    })
    .then((result) => {
      const resultList = result.getResultList();
      if (resultList.length != 0)
      {
      //Pretty print the result list
      console.log("The result List is ", JSON.stringify(resultList, null, 2));
      var totalamount = resultList[0].CurrentBalance + amounttoadd;
      console.log('Total Amount to add is ', totalamount);
      var new_currentbalance = totalamount;
      var new_previousbalance = resultList[0].CurrentBalance;
      console.log('New total balance after add funds will be ', totalamount);
      //
      driver
       .executeLambda((txn) => {
           txn.execute(
        "UPDATE wallettable SET PreviousBalance = ?, CurrentBalance = ? WHERE email = ?",
        new_previousbalance,
        new_currentbalance,
        email
      );
    })
    .then(() => {
      const response = {
      statusCode: 200,
      body: JSON.stringify({message: `Amount of ${amounttoadd} added succesfully`, 
                      statuscode: 200,
                      CurrentBalance: new_currentbalance,
                      PreviousBalance: new_previousbalance,
                      author: 'Protected code owner- '
   }),
      };

       callback(null, response);
    })
    .then((result) => {
      driver.close();
    });
      }else{
        const response = {
        statusCode: 200,
        body: JSON.stringify({message: `User does not exist`, 
                      statuscode: 200,
                      author: 'Protected code owner- '
   }),
      };

       callback(null, response);
        
      }
      //
      })
    .then((result) => {
      driver.close();
    });
    
    //JSON response
  

//ADD FUNDS END
};
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// QLDB WithdrawFUNDS START
module.exports.qldbwithdrawfunds = function (event, context, callback) {
  const msgparse = JSON.parse(event.body);
    console.log('QLDBwithdraws function  ' + msgparse.email + " amount to be withdrawn " + msgparse.WithdrawFunds);
  
    //qldb Withdraw funds code START ----
  const driver = new qldb.QldbDriver("captable1", myConfig);
  const email = msgparse.email;
  var amounttowithdraw = msgparse.WithdrawFunds;
  
  driver
    .executeLambda(async (txn) => {
      return txn.execute(
        "select email, CurrentBalance, PreviousBalance from wallettable WHERE email = ?",
        email
      );
    })
    .then((result) => {
      const resultList = result.getResultList();
      if (resultList.length != 0)
      {
      //Pretty print the result list
      console.log("The result List is ", JSON.stringify(resultList, null, 2));
      var totalamount = resultList[0].CurrentBalance - amounttowithdraw;
      console.log('New total balance will be ', totalamount);
      var currentbalance = resultList[0].CurrentBalance;
      var previousbalance = resultList[0].PreviousBalance;
      
      if (totalamount >=0) 
      {
      var new_currentbalance = totalamount;
      var new_previousbalance = resultList[0].CurrentBalance;
      //
      driver
       .executeLambda((txn) => {
           txn.execute(
        "UPDATE wallettable SET PreviousBalance = ?, CurrentBalance = ? WHERE email = ?",
        new_previousbalance,
        new_currentbalance,
        email
      );
    })
    .then(() => {
      const response = {
      statusCode: 200,
      body: JSON.stringify({message: `Withdrawal of ${amounttowithdraw} succesful`, 
                      statuscode: 200,
                      CurrentBalance: new_currentbalance,
                      PreviousBalance: new_previousbalance,
                      author: 'Protected code owner- '
   }),
      };

       callback(null, response);
    })
    .then((result) => {
      driver.close();
    });
      }else{
      const response = {
      statusCode: 200,
      body: JSON.stringify({message: `Withdrawal of ${amounttowithdraw} failed, Insufficient funds to withdraw`, 
                      statuscode: 200,
                      CurrentBalance: currentbalance,
                      PreviousBalance: previousbalance,
                      author: 'Protected code owner- '
   }),
      };

       callback(null, response);  
      }
    }
    else{
          const response = {
          statusCode: 200,
          body: JSON.stringify({message: `Invalid user does not exist`, 
                      statuscode: 200,
                      author: 'Protected code owner- '
   }),
      };

       callback(null, response);  
    }
      //
      })
    .then((result) => {
      driver.close();
    });
    
    //JSON response
  

//QLDB WithdrawFUNDS END
};
//------------------------------------------------------------------------------

