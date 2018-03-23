let User = require("../models/user.js")
let Skill = require("../models/skill")
let Contract = require("../models/contract.js")
let ObjectID = require('mongodb').ObjectID
const mongoose = require("mongoose")

process.env.NODE_ENV = 'test'

let chai = require("chai")
let chaiHttp = require('chai-http');

let expect = chai.expect
let should = chai.should()
chai.use(chaiHttp);


var token
var baseUrl = "http://localhost:3002"
var endpointUrl = baseUrl + "/api/contracts"

//DATA
var invalidId = new ObjectID()

var skillIds = [
    new ObjectID(),
    new ObjectID(),
    new ObjectID()
]

var userIds = [
    new ObjectID(),
    new ObjectID(),
    new ObjectID()
]

var skills = [
    {
        _id: skillIds[0],
        skill: "Cool Skateboard Tricks"
    },
    {
        _id: skillIds[1],
        skill: "Skullduggery"
    },
    {
        _id: skillIds[2],
        skill: "Shenanigans"
    }
]

var users = [
    {//user[0] - the one we log in with
        _id: userIds[0],
        name: {
            first: "Mark",
            last: "Ripptoe"
        },
        address: {
            postalCode: "r3p1z2",
            street: "Fake St",
            number: 55,
            city: "Soykaf",
            state: "Machine",
            country: "Glorious Nihon"
        },
        about: "I'm the testiest user there is!",
        email: "test@test.ca",
        password: "password",
        has: [
            {
                category: {
                    _id: skillIds[0],
                },
                description: "Like the sport."
            },
        ],
        wants: [
            {
                category: {
                    _id: skillIds[1],
                },
                description: "I need some quark gluon plasma."
            },
            {
                category: {
                    _id: skillIds[2],
                },
                description: "Like the sport."
            }
        ]
    },
    {
        _id: userIds[1],
        name: {
            first: "Shark",
            last: "Hamil"
        },
        address: {
            postalCode: "x0x0xA",
            street: "Last Jedi Road",
            number: 8,
            city: "Tattoo Knee",
            state: "Decay",
            country: "Alderode"
        },
        about: "I'm the testiest teacher there is!",
        email: "jebi@theforke.rom",
        password: "password",
        has: [
            {
                category: {
                    _id: skillIds[2],
                },
                description: "I can do Processing and not much else."
            },
            {
                category: {
                    _id: skillIds[0],
                },
                description: "Like the sport. Mathletics."
            }
        ],
        wants: [
            {
                category: {
                    _id: skillIds[1],
                },
                description: "I need someone to take my stolen goods."
            },
        ]
    },
    {
        _id: userIds[2],
        name: {
            first: "Clark",
            last: "Kent"
        },
        address: {
            postalCode: "123456",
            street: "Fake St",
            number: 7890,
            city: "ABCD",
            state: "EF",
            country: "Free Country USA"
        },
        about: "I'm the not testiest user there is :c",
        email: "uber@mensch.de",
        password: "crassword",
        has: [
            {
                category: {
                    _id: skillIds[1],
                },
                description: "Like the sport."
            },
            {
                category: {
                    _id: skillIds[2],
                },
                description: "Like the sport."
            }
        ],
        wants: [
            {
                category: {
                    _id: skillIds[0],
                },
                description: "I need some quark gluon plasma."
            }
        ]
    }
]

var favours = [
    {
       skillId: skillIds[0],
       description: "Winky Face",
       completed: false
    },
    {
        skillId: skillIds[1],
        description: "Wonky Face",
        completed: false
     },
     {
        skillId: skillIds[2],
        description: "Wanky Face (eww)",
        completed: false
     },
     {
        skillId: skillIds[0],
        description: "Cranky Face",
        completed: true
     },
     {
         skillId: skillIds[1],
         description: "Chunky Face",
         completed: true
      },
      {
         skillId: skillIds[2],
         description: "Lanky Face (eww)",
         completed: true
      }
 ]

var contracts = [
    {//contracts[0] - pending contract between user0 and user2
        offeror: {
            id: userIds[0],
            favours: favours[0],
            name: {
                first: users[0].name.first,
                last: users[0].name.last
            },
            requestTermination: false
        },
        offeree: {
            id: userIds[2],
            favours: favours[2],
            name: {
                first: users[2].name.first,
                last: users[2].name.last
            },
            requestTermination: false
        },
        status: 'Pending',
        messages:[]
    },
    {//contracts[1] - pending contract between user1 and user2
        offeror: {
            id: userIds[1],
            favours: favours[2],
            name: {
                first: users[1].name.first,
                last: users[1].name.last
            },
            requestTermination: false
        },
        offeree: {
            id: userIds[2],
            favours: favours[1],
            name: {
                first: users[2].name.first,
                last: users[2].name.last
            },
            requestTermination: false
        },
        status: 'Pending',
        messages:[]
    },
    {//contracts[2] - accepted contract between user2 and user0
        offeror: {
            id: userIds[2],
            favours: favours[1],
            name: {
                first: users[2].name.first,
                last: users[2].name.last
            },  
            requestTermination: true
        },
        offeree: {
            id: userIds[0],
            favours: favours[0],
            name: {
                first: users[0].name.first,
                last: users[0].name.last
            },
            requestTermination: false
        },
        status: 'Accepted',
        messages:[]
    },
    {//contracts[3] - declined contract between user2 and user0
        offeror: {
            id: userIds[2],
            favours: favours[1],
            name: {
                first: users[2].name.first,
                last: users[2].name.last
            },  
            requestTermination: true
        },
        offeree: {
            id: userIds[0],
            favours: favours[0],
            name: {
                first: users[0].name.first,
                last: users[0].name.last
            },
            requestTermination: false
        },
        status: 'Declined',
        messages:[]
    },
    {//all zeroes
        offeror: {
            id: userIds[0],
            favours: favours[0],
            name: {
                first: users[0].name.first,
                last: users[0].name.last
            },
            requestTermination: false
        },
        offeree: {
            id: userIds[0],
            favours: favours[0],
            name: {
                first: users[0].name.first,
                last: users[0].name.last
            },
            requestTermination: false
        },
        status: 'Pending',
        messages:[]
    }
]

var badContracts = [
    {//contracts[0] - missing offeror
        offeree: {
            id: userIds[0],
            favours: favours[0],
            name: {
                first: users[0].name.first,
                last: users[0].name.last
            },
            requestTermination: false
        },
        status: 'Pending',
        messages:[]
    },
    {//contracts[1] - missing offeree
        offeror: {
            id: userIds[0],
            favours: favours[0],
            name: {
                first: users[0].name.first,
                last: users[0].name.last
            },
            requestTermination: false
        },
        status: 'Pending',
        messages:[]
    },
    {//contracts[2] - missing a user id in offeror
        offeror: {
            favours: favours[0],
            name: {
                first: users[0].name.first,
                last: users[0].name.last
            },
            requestTermination: false
        },
        offeree: {
            id: userIds[0],
            favours: favours[0],
            name: {
                first: users[0].name.first,
                last: users[0].name.last
            },
            requestTermination: false
        },
        status: 'Pending',
        messages:[]
    },
    {//contracts[3] - missing a favour in offeror
        offeror: {
            id: userIds[0],
            name: {
                first: users[0].name.first,
                last: users[0].name.last
            },
            requestTermination: false
        },
        offeree: {
            id: userIds[0],
            favours: favours[0],
            name: {
                first: users[0].name.first,
                last: users[0].name.last
            },
            requestTermination: false
        },
        status: 'Pending',
        messages:[]
    },
    {//contracts[4] - missing a name in offeror
        offeror: {
            id: userIds[0],
            favours: favours[0],
            requestTermination: false
        },
        offeree: {
            id: userIds[0],
            favours: favours[0],
            name: {
                first: users[0].name.first,
                last: users[0].name.last
            },
            requestTermination: false
        },
        status: 'Pending',
        messages:[]
    }
]
//END OF DATA
//PROMISES
var addUsers = users.map((user)=>{
    return new Promise((resolve,reject)=>{
        newUser = new User(user)
        newUser.save((err,res)=>{
            if(err){
                reject(err)
            } else {
                console.log("guser added")
                resolve(res)
            }
        })
    })
})

function addSkills(){
return new Promise((resolve, reject) => {
    Skill.insertMany(skills, (error, docs) => {
        if (error) {
            reject(error)
        }
        else {
            console.log("gills added")
            resolve(docs)
        }
    })
})
}

function connect(){
    return new Promise((resolve, reject) => {
    require('dotenv').config({ path: __dirname + '/../.env' })
    process.env.NODE_ENV = 'test'
    let db = require("../db")
    server = require('../server')
    db.getConnection(false)
    console.log("gonnected")
    resolve('connected')
})
}

function login(){
    return new Promise((resolve,reject)=>{
        chai.request(baseUrl)
        .post("/api/users/login")
        .send({
            email: "test@test.ca",
            password: "password"
        })
        .end((err, res) => {
            if (err) {
                reject(err)
            }
            console.log("gogged in")
            token = res.body.token;
            console.log("Token" + token)
            resolve(res.body.token)
        })
    })
}

function clearDB(){
    return new Promise((resolve,reject)=>{
        User.remove({}, () => {
            Skill.remove({}, () => {
                Contract.remove({},()=>{
                    resolve()
                })
            })
        })
    })
}
//END OF PROMISES

//TESTS
describe("Contract API Tests", () => {
    before((done) => {
        connect().then((connectionResult) => {
            clearDB().then((clearDBResult)=>{
                addSkills().then((skillsResult) => {
                    Promise.all(addUsers).then((userResults) => {
                            login().then((loginResult)=>{
                                done()
                            })
                    })
                })
            })
        })
    })

    afterEach((done) => {
        Contract.remove({}, () => {
            done()
        })
    })

    after((done) => {
        User.remove({}, () => {
            Skill.remove({}, () => {
                mongoose.disconnect()
                done()
            })
        })
    })

    describe("get / Test", (done) => {
        it("Should return nothing if current user hasn't made any contracts", (done) => {
            chai.request(endpointUrl)
                .get("/")
                .set("Authorization", token)
                .end((err, res) => {
                    expect(err).to.equal(null)
                    expect(res.body).to.have.lengthOf(0)
                    done()
                })
        })

        it("Should return some stuff if current user has contracts", (done) => {
            newContract = new Contract(contracts[0])
            newContract.save((err,res)=>{
                chai.request(endpointUrl)
                .get('/')
                .set("Authorization", token)
                .end((err,res)=>{
                    expect(err).to.equal(null)
                    expect(res.body).to.have.lengthOf(1)
                    done()
                })
            })
        })

        it("Should return both active and inactive contracts if current user has contracts", (done) => {
            Contract.insertMany([contracts[0],contracts[2],contracts[3]],(err,docs)=>{
                chai.request(endpointUrl)
                .get('/')
                .set("Authorization", token)
                .end((err,res)=>{
                    expect(err).to.equal(null)
                    expect(res.body).to.have.lengthOf(3)
                    done()
                })
            })
        })

        it("Should return an error without authorization", (done) => {
            chai.request(endpointUrl)
                .get("/")
                .end((err, res) => {
                    expect(err.status).to.equal(401)
                    done()
                })
        })

        it("Should return an error without valid authorization", (done) => {
            chai.request(endpointUrl)
                .get("/")
                .set("Authorization", token + "101010101010001010")
                .end((err, res) => {
                    expect(err.status).to.equal(401)
                    done()
                })
        })
    })

    describe.only("post / Test", (done) => {
        it("Should return the complete contract we create if the contract is valid.",(done)=>{
            chai.request(endpointUrl)
            .post('/')
            .set("Authorization", token)
            .send(contracts[0])
            .end((err,res)=>{
                expect(err).to.equal(null)
                expect(res.status).to.equal(200)
                expect(res.body.offeror.id).to.equal(String(contracts[0].offeror.id))
                expect(res.body.offeree.id).to.equal(String(contracts[0].offeree.id))
                expect(res.body.status).to.equal('Pending')
                done()
            })
        })

        it("Should say required fields are missing when we have no offeror",(done)=>{
            chai.request(endpointUrl)
            .post('/')
            .set("Authorization", token)
            .send(badContracts[0])
            .end((err,res)=>{
                expect(err).to.equal(null)
                expect(res.status).to.equal(400)
                expect(res.message).to.equal("Required fields are missing.")
                expect(res.succes).to.equal(false)
                done()
            })
        })

        it("Should say required fields are missing when we have no offeree",(done)=>{
            chai.request(endpointUrl)
            .post('/')
            .set("Authorization", token)
            .send(badContracts[1])
            .end((err,res)=>{
                expect(err).to.equal(null)
                expect(res.status).to.equal(400)
                expect(res.message).to.equal("Required fields are missing.")
                expect(res.succes).to.equal(false)
                done()
            })
        })

        it("Should say required fields are missing when we have no user id in offeror",(done)=>{
            chai.request(endpointUrl)
            .post('/')
            .set("Authorization", token)
            .send(badContracts[2])
            .end((err,res)=>{
                expect(err).to.equal(null)
                expect(res.status).to.equal(400)
                expect(res.message).to.equal("Required fields are missing.")
                expect(res.succes).to.equal(false)
                done()
            })
        })

        it("Should say required fields are missing when we have no favour in offeror",(done)=>{
            chai.request(endpointUrl)
            .post('/')
            .set("Authorization", token)
            .send(badContracts[3])
            .end((err,res)=>{
                expect(err).to.equal(null)
                expect(res.status).to.equal(400)
                expect(res.message).to.equal("Required fields are missing.")
                expect(res.succes).to.equal(false)
                done()
            })
        })

        it("Should say required fields are missing when we have no name in offeror",(done)=>{
            chai.request(endpointUrl)
            .post('/')
            .set("Authorization", token)
            .send(badContracts[4])
            .end((err,res)=>{
                expect(err).to.equal(null)
                expect(res.status).to.equal(400)
                expect(res.message).to.equal("Required fields are missing.")
                expect(res.succes).to.equal(false)
                done()
            })
        })

        it("Should return an error without authorization",(done)=>{
            chai.request(endpointUrl)
            .post("/")
            .end((err, res) => {
                expect(err.status).to.equal(401)
                done()
            })
        })

        it("Should return an error without valid authorization",(done)=>{
            chai.request(endpointUrl)
                .post("/")
                .set("Authorization", token + "101010101010001010")
                .end((err, res) => {
                    expect(err.status).to.equal(401)
                    done()
                })
        })
    })

    describe("get /active Test", (done) => {
        it("Should return an error without authorization",(done)=>{
            chai.request(endpointUrl)
            .get("/active")
            .end((err, res) => {
                expect(err.status).to.equal(401)
                done()
            })
        })

        it("Should return an error without valid authorization",(done)=>{
            chai.request(endpointUrl)
                .get("/active")
                .set("Authorization", token + "101010101010001010")
                .end((err, res) => {
                    expect(err.status).to.equal(401)
                    done()
                })
        })
    })

    describe("get /received Test", (done) => {
        it("Should return an error without authorization",(done)=>{
            chai.request(endpointUrl)
            .get("/received")
            .end((err, res) => {
                expect(err.status).to.equal(401)
                done()
            })
        })

        it("Should return an error without valid authorization",(done)=>{
            chai.request(endpointUrl)
                .get("/received")
                .set("Authorization", token + "101010101010001010")
                .end((err, res) => {
                    expect(err.status).to.equal(401)
                    done()
                })
        })
    })

    describe("get /sent Test", (done) => {
        it("Should return an error without authorization",(done)=>{
            chai.request(endpointUrl)
            .get("/sent")
            .end((err, res) => {
                expect(err.status).to.equal(401)
                done()
            })
        })

        it("Should return an error without valid authorization",(done)=>{
            chai.request(endpointUrl)
                .get("/sent")
                .set("Authorization", token + "101010101010001010")
                .end((err, res) => {
                    expect(err.status).to.equal(401)
                    done()
                })
        })
    })

    describe("put /:id Test", (done) => {
        it("Should return an error without a valid id",(done)=>{

        })

        it("Should return an error without authorization",(done)=>{

        })

        it("Should return an error without valid authorization",(done)=>{
            
        })
    })

    describe("put /:id/terminate Test", (done) => {
        it("Should return an error without a valid id",(done)=>{
            
        })

        it("Should return an error without authorization",(done)=>{

        })

        it("Should return an error without valid authorization",(done)=>{
            
        })
    })
})