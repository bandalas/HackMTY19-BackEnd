const firebase  = require('firebase');

let ApiController = {};

function fetchRecordByMonth(startDate, endDate, callback) {
    let ref  = firebase.database().ref();
    ref.orderByChild('date')
        .startAt(startDate)
        .endAt(endDate)
        .on('value', function(snapshot){
            callback(snapshot);
    });
}

function groupRecordsByProduct(records) {
    let dict = {};
    records.forEach(function(recordObj){
        let record = recordObj.val();
        if(!dict[record.product]){
            let arr = [];
            arr.push(record);
            dict[record.product] = arr;
        }else {
            let temp = dict[record.product];
            temp.push(record);
            dict[record.product] = temp;
        }
    });
    return dict;
}

function sumOfProductPerMonth(productDict){
    let productsSum = {};
    for(let key in productDict){
        let values = productDict[key];
        let sum = 0;
        let price = 0;

        values.forEach(function(record){
            sum += record.sa_quantity;
            price = price == 0 ? record.price : price;
        });
        productsSum["_"+key] = {
            quantity: sum,
            total: sum * price
        };
    }
    return productsSum;
}

ApiController.fetchMonthRecords = function(callback) {
    fetchRecordByMonth('2012-01-01', '2012-01-31', function(firstRecordsObj){
        fetchRecordByMonth('2012-02-01', '2012-02-28', function(secondRecords){
            fetchRecordByMonth('2012-03-01', '2012-03-31', function(thirdRecords){
                callback({
                    first: {
                        records: firstRecordsObj.val(),
                        obj: firstRecordsObj
                    },
                    second: {
                        records: secondRecords.val(),
                        obj: secondRecords
                    },
                    third: {
                        records: thirdRecords.val(),
                        obj: thirdRecords
                    }
                });
            });
        });
    });
}

ApiController.fetchMonthRecordsStadistics = function(callback) {
    this.fetchMonthRecords(function(recordsObj){
        let firstProductGroup = groupRecordsByProduct(recordsObj.first.obj);
        let secondProductGroup = groupRecordsByProduct(recordsObj.second.obj);
        let thirdProductGroup = groupRecordsByProduct(recordsObj.third.obj);

        let firstSum = sumOfProductPerMonth(firstProductGroup);
        let secondSum = sumOfProductPerMonth(secondProductGroup);
        let thirdSum = sumOfProductPerMonth(thirdProductGroup);

        callback({
            first: {
                records: recordsObj.first.records,
                stadistics: firstSum,
            },
            second: {
                records: recordsObj.second.records,
                stadistics: secondSum
            },
            third: {
                records: recordsObj.third.records,
                stadistics: thirdSum
            }
        });
    });
}

module.exports = ApiController;