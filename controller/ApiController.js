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
    let sum = 0;
    let size = 0;
    for(let key in productDict){
        let record = productDict[key];
        sum += record.price == "" ? 0 : record.sa_quantity * record.price;
        if(record.price != "") size++;
    }
    return {
        total: sum,
        quantity: size
    };
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

        let firstSum = sumOfProductPerMonth(recordsObj.first.records);
        let secondSum = sumOfProductPerMonth(recordsObj.second.records);
        let thirdSum = sumOfProductPerMonth(recordsObj.third.records);

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