"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var service_1 = require("../shared/service");
var HomeComponent = /** @class */ (function () {
    function HomeComponent(titleService, _dataService) {
        this.titleService = titleService;
        this._dataService = _dataService;
        //API
        this._genTokenUrl = 'api/bkash/getbKashToken';
        this._bkPayCreateUrl = 'api/bKash/createPayment';
        this._bkPayExecuteUrl = 'api/bKash/executePayment';
        this._bkPaySaveUrl = 'api/bKash/savePayment';
    }
    HomeComponent.prototype.ngOnInit = function () {
        this.titleService.setTitle("Home");
        this.title = 'Angular8';
    };
    HomeComponent.prototype.ngAfterViewInit = function () {
        this.genToken();
    };
    //Generate bKash Authorization Token
    HomeComponent.prototype.genToken = function () {
        var _this = this;
        var result;
        this._dataService.get(this._genTokenUrl)
            .subscribe(function (response) {
            result = response;
            var resdata = result.resdata;
            if (resdata != null)
                _this.initBkash(resdata);
        }, function (error) {
            console.log(error);
        });
    };
    //bKash Checkout
    HomeComponent.prototype.initBkash = function (resdata) {
        var dataService = this._dataService;
        var bkPayCreateUrl = this._bkPayCreateUrl;
        var bkPayExecuteUrl = this._bkPayExecuteUrl;
        //Pay Amount
        var amount = 231.00; //Change Amount
        //Authorization Token
        this.token = JSON.parse(resdata.authToken).id_token;
        //Create PaymentModel
        var createPayModel = {
            authToken: this.token,
            amount: amount,
            intent: resdata.intent,
            currency: resdata.currency,
            merchantInvoiceNumber: resdata.merchantInvoiceNumber
        };
        //Execute PaymentModel
        var executePayModel = {
            authToken: this.token,
            paymentID: null
        };
        //Init bKash
        bKash.init({
            paymentMode: 'checkout',
            paymentRequest: {
                "amount": amount,
                "intent": resdata.intent,
                "currency": resdata.currency,
                "merchantInvoiceNumber": resdata.merchantInvoiceNumber
            },
            //Payment Process
            createRequest: function () {
                dataService.save(createPayModel, bkPayCreateUrl)
                    .subscribe(function (response) {
                    var data = JSON.parse(response.resdata);
                    if (data && data.paymentID != null) {
                        executePayModel.paymentID = data.paymentID;
                        //Call iFrame
                        data.errorCode = null;
                        data.errorMessage = null;
                        bKash.create().onSuccess(data);
                    }
                    else {
                        bKash.create().onError();
                    }
                }, function (error) {
                    bKash.create().onError();
                });
            },
            //Payment Execute
            executeRequestOnAuthorization: function () {
                var _this = this;
                $('#payment_status').val('');
                dataService.save(executePayModel, bkPayExecuteUrl)
                    .subscribe(function (response) {
                    $('#close_button').click();
                    _this.result = JSON.parse(response.resdata);
                    if (_this.result && _this.result.paymentID != null) {
                        $('#bKashFrameWrapper').fadeOut();
                        //Save to Database
                        localStorage.setItem('paymentresult', JSON.stringify(_this.result));
                        $('#hiddenButton').click();
                    }
                    else {
                        bKash.execute().onError();
                    }
                }, function (error) {
                    bKash.execute().onError();
                });
            },
            //On Success
            onSuccess: function () { },
            //Close
            onClose: function () { }
        });
        $('#bKash_button').removeAttr('disabled');
    };
    HomeComponent.prototype.savePayment = function () {
        var paydata = JSON.parse(localStorage.getItem('paymentresult'));
        this.transResult = JSON.stringify(paydata);
        if (paydata != null) {
            this._dataService.save(paydata, this._bkPaySaveUrl)
                .subscribe(function (response) {
                if (response != null)
                    alert(response.resdata);
            }, function (error) {
                console.log(error);
            });
            localStorage.removeItem('paymentresult');
        }
    };
    HomeComponent = __decorate([
        core_1.Component({
            selector: 'app-home',
            templateUrl: './app/home/component.html',
            providers: [service_1.DataService]
        }),
        __metadata("design:paramtypes", [platform_browser_1.Title,
            service_1.DataService])
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
