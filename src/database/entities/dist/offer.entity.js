"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var typeorm_1 = require("typeorm");
var constants_1 = require("src/misc/constants");
var Offer = /** @class */ (function (_super) {
    __extends(Offer, _super);
    function Offer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Offer_1 = Offer;
    Offer.of = function (userId, userId_accepter, startlocation, endlocation, date, price_absolute, price_per_freight, price_per_person, seats, stops, weight, mass_x, mass_y, mass_z, smoking, animals, status, notes) {
        return __awaiter(this, void 0, void 0, function () {
            var offer;
            return __generator(this, function (_a) {
                offer = new Offer_1();
                offer.userId = userId;
                offer.userId_accepter = userId_accepter;
                offer.startlocation = startlocation;
                offer.endlocation = endlocation;
                offer.date = date;
                offer.price_absolute = price_absolute;
                offer.price_per_freight = price_per_freight;
                offer.price_per_person = price_per_person;
                offer.seats = seats;
                offer.stops = stops;
                offer.weight = weight;
                offer.mass_x = mass_x;
                offer.mass_y = mass_y;
                offer.mass_z = mass_z;
                offer.smoking = smoking;
                offer.animals = animals;
                offer.status = status;
                offer.notes = notes;
                return [2 /*return*/, offer];
            });
        });
    };
    var Offer_1;
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], Offer.prototype, "id");
    __decorate([
        typeorm_1.Column()
    ], Offer.prototype, "userId");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], Offer.prototype, "userId_accepter");
    __decorate([
        typeorm_1.Column()
    ], Offer.prototype, "startlocation");
    __decorate([
        typeorm_1.Column()
    ], Offer.prototype, "endlocation");
    __decorate([
        typeorm_1.Column()
    ], Offer.prototype, "date");
    __decorate([
        typeorm_1.Column({ nullable: true, type: 'real' })
    ], Offer.prototype, "price_absolute");
    __decorate([
        typeorm_1.Column({ nullable: true, type: 'real' })
    ], Offer.prototype, "price_per_freight");
    __decorate([
        typeorm_1.Column({ nullable: true, type: 'real' })
    ], Offer.prototype, "price_per_person");
    __decorate([
        typeorm_1.Column()
    ], Offer.prototype, "seats");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], Offer.prototype, "stops");
    __decorate([
        typeorm_1.Column({ nullable: true, type: 'real' })
    ], Offer.prototype, "weight");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], Offer.prototype, "mass_x");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], Offer.prototype, "mass_y");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], Offer.prototype, "mass_z");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], Offer.prototype, "smoking");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], Offer.prototype, "animals");
    __decorate([
        typeorm_1.Column({ "default": constants_1.Status.statusPending })
    ], Offer.prototype, "status");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], Offer.prototype, "notes");
    Offer = Offer_1 = __decorate([
        typeorm_1.Entity()
    ], Offer);
    return Offer;
}(typeorm_1.BaseEntity));
exports["default"] = Offer;
