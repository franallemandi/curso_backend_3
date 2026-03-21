import supertest from "supertest";
import { expect } from "chai";
import mongoose from "mongoose";
import app from "../src/app.js";

import UserModel from '../src/dao/models/User.js';
import PetModel from '../src/dao/models/Pet.js';
import AdoptionModel from '../src/dao/models/Adoption.js';

const requester = supertest(app);

let testUser;
let testUserB;
let testPet;
let testPetB;
let testPetC;
let createdAdoption;
let fakeId;

describe("Test de Adoptions API", function () {
    before(async function () {
        await mongoose.connect(process.env.MONGODB_URL);
        const uniqueEmail = `testuser_${Date.now()}@example.com`;

        testUser = await UserModel.create({first_name: "Test", last_name: "User", email: uniqueEmail, password: "password123"});
        testUserB = await UserModel.create({first_name: "Test2", last_name: "User2", email: uniqueEmail + "b", password: "password123"});
        testPet = await PetModel.create({name: "Test Pet", specie: "Perro"});
        testPetB = await PetModel.create({name: "Test Pet B", specie: "Gato"});
        testPetC = await PetModel.create({name: "Test Pet C", specie: "Pájaro", adopted: true});
        createdAdoption = await AdoptionModel.create({owner: testUser._id, pet: testPet._id});
        fakeId = new mongoose.Types.ObjectId();
    }); 
    describe("GET /api/adoptions", function () {
        it("Debería devolver todas las adopciones y un estado de éxito (200)", async function () {
            const { status, body } = await requester.get("/api/adoptions");
            expect(status).to.equal(200);
            expect(body).to.be.an("object");
            expect(body).to.have.property("status");
            expect(body.status).to.equal("success");
            expect(body).to.have.property("payload");
            expect(body.payload).to.be.an("array");
        }
        );
    });
    describe("GET /api/adoptions/:aid", function () {
        it("Debería devolver la adopción con el ID especificado y un estado de éxito (200)", async function () {
            const { status, body } = await requester.get(`/api/adoptions/${createdAdoption._id}`);
            expect(status).to.equal(200);
            expect(body).to.be.an("object");
            expect(body).to.have.property("status");
            expect(body.status).to.equal("success");
            expect(body).to.have.property("payload");
            expect(body.payload).to.have.property("_id");
            expect(body.payload._id).to.equal(createdAdoption._id.toString());
        });
        it("Debería devolver error si el id no existe", async function () {
            const { status, body } = await requester.get(`/api/adoptions/${fakeId}`);
            expect(status).to.equal(404);
            expect(body).to.be.an("object");
            expect(body).to.have.property("status");
            expect(body.status).to.equal("error");
            expect(body).to.have.property("error");
            expect(body.error).to.equal("Adoption not found");
        }
        );
    });
    describe("POST /api/adoptions/:uid/:pid", function () {
        it("Debería crear una nueva adopción con el usuario y mascota especificados y devolver un estado de éxito (200)", async function () {
            const { status, body } = await requester.post(`/api/adoptions/${testUserB._id}/${testPetB._id}`);
            expect(status).to.equal(200);
            expect(body).to.be.an("object");
            expect(body).to.have.property("status");
            expect(body.status).to.equal("success");
            expect(body).to.have.property("message");
            expect(body.message).to.equal("Pet adopted");
        });
        it("Debería devolver error si el usuario no existe", async function () {
            const { status, body } = await requester.post(`/api/adoptions/${fakeId}/${testPetB._id}`);
            expect(status).to.equal(404);
            expect(body).to.be.an("object");
            expect(body).to.have.property("status");
            expect(body.status).to.equal("error");
            expect(body).to.have.property("error");
            expect(body.error).to.equal("user Not found");
        });
        it("Debería devolver error si la mascota no existe", async function () {
            const { status, body } = await requester.post(`/api/adoptions/${testUserB._id}/${fakeId}`);
            expect(status).to.equal(404);
            expect(body).to.be.an("object");
            expect(body).to.have.property("status");
            expect(body.status).to.equal("error");
            expect(body).to.have.property("error");
            expect(body.error).to.equal("Pet not found");
        });
        it("Debería devolver error si la mascota ya fue adoptada", async function () {
            const { status, body } = await requester.post(`/api/adoptions/${testUserB._id}/${testPetC._id}`);
            expect(status).to.equal(400);
            expect(body).to.be.an("object");
            expect(body).to.have.property("status");
            expect(body.status).to.equal("error");
            expect(body).to.have.property("error");
            expect(body.error).to.equal("Pet is already adopted");
        }
        );
    });
    after(async function () {
        try {
            await AdoptionModel.deleteMany({});
            await PetModel.deleteMany({});
            await UserModel.deleteMany({});
            await mongoose.connection.close();
        } catch (error) {
            console.error("Error al limpiar la base de datos:", error.message);
        }
    });
});
