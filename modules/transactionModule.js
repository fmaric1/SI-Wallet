import { getUsers, getUserDetails, getRecipientDetails } from "./userModule";

import * as SecureStore from 'expo-secure-store';
var link = 'https://processingserver.herokuapp.com'

async function getToken() {
    const token = await SecureStore.getItemAsync("secure_token");
    
    return token;
}


export async function submitTransaction(amount, paymentType, recipientName, recipientAccountNumber, description, phoneNumber,
    currency, category) {
    try {
        acc = await getAccounts();
        account = acc.filter(item => item.currency == currency)

        accNumber = 'ABC'
        if (account.length != 0)
            accNumber = account[0].accountNumber
        
        
        token = await getToken();
        
            await fetch(link + '/api/Transaction/CreateTransaction?token=' + token , {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },

                body: JSON.stringify(
                    {
                        amount: amount,
                        currency: currency,
                        transactionType: paymentType,
                        transactionPurpose: description,
                        category: category,
                        sender: {
                            accountNumber: accNumber
                        },
                        recipient: {
                            name: recipientName,
                            accountNumber: recipientAccountNumber
                        }
                        
                    }              ),
            }).then((response) => {
                if (response.status == 200) {
                    alert("Transaction successful!");
                    return;
                } else {
                    alert("Transaction not successful!");
                    return;
                }
            });
        
    } catch (error) {
        console.error(error);
    }
}

export async function getTransactions(page, pageSize) {
    try {
      

        const token = await getToken();
        const fetchedData = await fetch(link + '/api/Transaction/GetTransactionsForUser?token=' + token + '&pageNumber=' + page + '&pageSize=' + pageSize + '&sortingOrder=createdatdesc')

        const data = await fetchedData.json();

        return data;


    } catch (error) {
        console.error(error);
        throw error;
    }
}
export async function getTransactionById(id) {
    try {

        const token = await getToken();
        const fetchedData = await fetch(link + '/api/Transaction/GetTransactionById?token=' + token + '&transactionId=' + id)

        const data = await fetchedData.json();

        return data;


    } catch (error) {
        console.error(error);
        throw error;
    }
}


export async function getAccounts() {
    try {

        const token = await getToken();
        const fetchedData = await fetch(link + '/api/UserBankAccount/GetAllAccountsForUser?token=' + token)
       
        const data = await fetchedData.json();
        
        return data;
   
 
    } catch (error) { 
        console.error(error);
        throw error;
    }
}

