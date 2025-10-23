"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnidadeSchema = exports.Unidades = void 0;
//schemas/unity.schema.ts
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var mongoose_3 = require("mongoose");
var Unidades = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({
            timestamps: true
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = mongoose_3.Document;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _order_decorators;
    var _order_initializers = [];
    var _order_extraInitializers = [];
    var _category_decorators;
    var _category_initializers = [];
    var _category_extraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _text_decorators;
    var _text_initializers = [];
    var _text_extraInitializers = [];
    var _Contenidos_decorators;
    var _Contenidos_initializers = [];
    var _Contenidos_extraInitializers = [];
    var _Lecciones_decorators;
    var _Lecciones_initializers = [];
    var _Lecciones_extraInitializers = [];
    var Unidades = _classThis = /** @class */ (function (_super) {
        __extends(Unidades_1, _super);
        function Unidades_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.name = __runInitializers(_this, _name_initializers, void 0);
            _this.order = (__runInitializers(_this, _name_extraInitializers), __runInitializers(_this, _order_initializers, void 0));
            _this.category = (__runInitializers(_this, _order_extraInitializers), __runInitializers(_this, _category_initializers, void 0));
            _this.title = (__runInitializers(_this, _category_extraInitializers), __runInitializers(_this, _title_initializers, void 0));
            _this.text = (__runInitializers(_this, _title_extraInitializers), __runInitializers(_this, _text_initializers, void 0));
            _this.Contenidos = (__runInitializers(_this, _text_extraInitializers), __runInitializers(_this, _Contenidos_initializers, void 0));
            _this.Lecciones = (__runInitializers(_this, _Contenidos_extraInitializers), __runInitializers(_this, _Lecciones_initializers, void 0));
            __runInitializers(_this, _Lecciones_extraInitializers);
            return _this;
        }
        return Unidades_1;
    }(_classSuper));
    __setFunctionName(_classThis, "Unidades");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _name_decorators = [(0, mongoose_1.Prop)()];
        _order_decorators = [(0, mongoose_1.Prop)()];
        _category_decorators = [(0, mongoose_1.Prop)()];
        _title_decorators = [(0, mongoose_1.Prop)()];
        _text_decorators = [(0, mongoose_1.Prop)()];
        _Contenidos_decorators = [(0, mongoose_1.Prop)([{ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Contenidos' }])];
        _Lecciones_decorators = [(0, mongoose_1.Prop)([{ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Lecciones' }])];
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _order_decorators, { kind: "field", name: "order", static: false, private: false, access: { has: function (obj) { return "order" in obj; }, get: function (obj) { return obj.order; }, set: function (obj, value) { obj.order = value; } }, metadata: _metadata }, _order_initializers, _order_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: function (obj) { return "category" in obj; }, get: function (obj) { return obj.category; }, set: function (obj, value) { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _text_decorators, { kind: "field", name: "text", static: false, private: false, access: { has: function (obj) { return "text" in obj; }, get: function (obj) { return obj.text; }, set: function (obj, value) { obj.text = value; } }, metadata: _metadata }, _text_initializers, _text_extraInitializers);
        __esDecorate(null, null, _Contenidos_decorators, { kind: "field", name: "Contenidos", static: false, private: false, access: { has: function (obj) { return "Contenidos" in obj; }, get: function (obj) { return obj.Contenidos; }, set: function (obj, value) { obj.Contenidos = value; } }, metadata: _metadata }, _Contenidos_initializers, _Contenidos_extraInitializers);
        __esDecorate(null, null, _Lecciones_decorators, { kind: "field", name: "Lecciones", static: false, private: false, access: { has: function (obj) { return "Lecciones" in obj; }, get: function (obj) { return obj.Lecciones; }, set: function (obj, value) { obj.Lecciones = value; } }, metadata: _metadata }, _Lecciones_initializers, _Lecciones_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Unidades = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Unidades = _classThis;
}();
exports.Unidades = Unidades;
exports.UnidadeSchema = mongoose_1.SchemaFactory.createForClass(Unidades);
