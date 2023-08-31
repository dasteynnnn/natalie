const helper = require('./helper/helper')

//wait for mongodb
beforeAll(async () => {
    await new Promise((r) => setTimeout(r, 25000));
}, 40000);

describe('Expense Management - Tracker', () => {
    let group_id, group_refId
    let expense_id, expense_refId

    //=====================================================
    //    CREATE NEW EXPENSE GROUP [CREATE-TRACKER-GROUP]              
    //=====================================================
    it('[CREATE-TRACKER-GROUP] /api/v1/expense/tracker/group/create', async() => {
        const response = await helper.post("/api/v1/expense/tracker/group/create", {
            "cid": "test-jest-cid",
            "name": "jest-test-dev"
        })
        expect(response.body.code).toEqual("S");
        expect(response.statusCode).toBe(200);
    });
    //=====================================================
    //          GET EXPENSE GROUPS [GET-ALL-GROUP]              
    //=====================================================
    it('[GET-ALL-GROUP] /api/v1/expense/tracker/group', async() => {
        const response = await helper.get("/api/v1/expense/tracker/group")
        let result = response.body.data;
        for(data of result){
            if(data.name == "jest-test-dev"){
                group_id = data.id
                group_refId = data.refId
            }
        }
        expect(response.body.code).toEqual("S");
        expect(response.statusCode).toBe(200);
    });
    //=====================================================
    //      UPDATE EXPENSE GROUP [UPDATE-TRACKER-GROUP]              
    //=====================================================
    it('[UPDATE-TRACKER-GROUP] /api/v1/expense/tracker/group/update/:id ', async() => {
        const response = await helper.put("/api/v1/expense/tracker/group/update/" + group_id, {
            "name": "jest-test-dev-update"
        })
        expect(response.body.code).toEqual("S");
        expect(response.statusCode).toBe(200);
    });
    //=====================================================
    //        CREATE NEW EXPENSE [NEW-EXPENSE]              
    //=====================================================
    it('[NEW-EXPENSE] /api/v1/expense/tracker/create', async() => {
        const response = await helper.post("/api/v1/expense/tracker/create", {
            "cid": "test-jest-cid",
            "name": "jest-test-dev",
            "type": "BILLS",
            "amount": 1,
            "gid": group_id
        })
        expect(response.body.code).toEqual("S");
        expect(response.statusCode).toBe(200);
    }, 15000);
    //=====================================================
    //          GET EXPENSES [GET-ALL-EXPENSE]              
    //=====================================================
    it('[GET-ALL-EXPENSE] /api/v1/expense/tracker', async() => {
        const response = await helper.get("/api/v1/expense/tracker")
        let result = response.body.data;
        for(data of result){
            if(data.name == "jest-test-dev"){
                expense_id = data.id
                expense_refId = data.refId
            }
        }
        expect(response.body.code).toEqual("S");
        expect(response.statusCode).toBe(200);
    });
    //=====================================================
    //           UPDATE EXPENSE [UPDATE-EXPENSE]              
    //=====================================================
    it('[UPDATE-EXPENSE] /api/v1/expense/tracker/update/:id ', async() => {
        const response = await helper.put("/api/v1/expense/tracker/update/" + expense_id, {
            "name": "jest-test-dev-updated",
            "type": "LOAN",
            "amount": 2
        })
        expect(response.body.code).toEqual("S");
        expect(response.statusCode).toBe(200);
    });
    //=====================================================
    //        GET GROUP EXPENSES [GROUP-EXPENSES]              
    //=====================================================
    it('[GROUP-EXPENSES] /api/v1/expense/tracker/group/expenses/:refId', async() => {
        const response = await helper.get("/api/v1/expense/tracker/group/expenses/" + group_refId)
        expect(response.body.code).toEqual("S");
        expect(response.statusCode).toBe(200);
    });
    //=====================================================
    //          DELETE EXPENSE [DELETE-EXPENSE]              
    //=====================================================
    it('[DELETE-EXPENSE] /api/v1/expense/tracker/delete/:id', async() => {
        const response = await helper.delete("/api/v1/expense/tracker/delete/" + expense_id)
        expect(response.body.code).toEqual("S");
        expect(response.statusCode).toBe(200);
    });
    //=====================================================
    //      DELETE EXPENSE GROUP [DELETE-TRACKER-GROUP]              
    //=====================================================
    it('[DELETE-TRACKER-GROUP] /api/v1/expense/tracker/group/delete/:id', async() => {
        const response = await helper.delete("/api/v1/expense/tracker/group/delete/" + group_id)
        expect(response.body.code).toEqual("S");
        expect(response.statusCode).toBe(200);
    });
});