using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Models;
using Newtonsoft.Json;
using Utilities;

namespace bKash.Controllers
{
    [ApiController, Route("api/[controller]"), Produces("application/json"), EnableCors("AppPolicy")]
    public class bKashController : ControllerBase
    {
        private static IConfiguration _configuration = null;
        private static bKashCredentials _objCredentials = null;
        private static bKashAPIs _objAPIs = null;

        public bKashController(IConfiguration iConfig)
        {
            _configuration = iConfig;

            //bKash SandBox Credentials
            _objCredentials = new bKashCredentials
            {
                app_key = _configuration.GetSection("bKashCredentials").GetSection("app_key").Value,
                app_secret = _configuration.GetSection("bKashCredentials").GetSection("app_secret").Value,
                bk_username = _configuration.GetSection("bKashCredentials").GetSection("username").Value,
                bk_password = _configuration.GetSection("bKashCredentials").GetSection("password").Value
            };

            //bKash API
            _objAPIs = new bKashAPIs
            {
                grantTokenUrl = _configuration.GetSection("bKashAPIs").GetSection("grantTokenUrl").Value,
                createUrl = _configuration.GetSection("bKashAPIs").GetSection("createUrl").Value,
                exucuteUrl = _configuration.GetSection("bKashAPIs").GetSection("exucuteUrl").Value
            };
        }

        // GET api/bKash/getbKashToken
        [HttpGet("[action]")]
        public async Task<object> getbKashToken()
        {
            object result = null; object resdata = null;
            try
            {
                using (var httpClientHandler = new HttpClientHandler())
                {
                    httpClientHandler.ServerCertificateCustomValidationCallback = (messages, cert, chain, errors) => { return true; };
                    using (var objClient = new HttpClient(httpClientHandler))
                    {
                        objClient.DefaultRequestHeaders.TryAddWithoutValidation("username", _objCredentials.bk_username);
                        objClient.DefaultRequestHeaders.TryAddWithoutValidation("password", _objCredentials.bk_password);

                        string data = "{ " + '"' + "app_key" + '"' + ": " + '"' + _objCredentials.app_key + '"' + ", " + '"' + "app_secret" + '"' + ": " + '"' + _objCredentials.app_secret + '"' + " }";
                        var content = new StringContent(data, Encoding.UTF8, "application/json");
                        using (HttpResponseMessage res = await objClient.PostAsync(_objAPIs.grantTokenUrl, content))
                        {
                            if (res.IsSuccessStatusCode)
                            {
                                var bkresult = res.Content.ReadAsStringAsync().Result;
                                bKmodel _objModel = new bKmodel()
                                {
                                    authToken = bkresult,
                                    appKey = _objCredentials.app_key,
                                    currency = "BDT",
                                    merchantInvoiceNumber = Common.genRandomNumber(11),
                                    intent = "sale"
                                };

                                resdata = _objModel;
                            }
                        }
                    }
                }
            }
            catch (Exception) { }
            return result = new
            {
                resdata
            };
        }

        // POST:  api/bKash/createPayment
        [HttpPost("[action]")]
        public async Task<object> createPayment([FromBody]object model)
        {
            object result = null; object resdata = null;
            try
            {
                bKmodel _bkModel = JsonConvert.DeserializeObject<bKmodel>(model.ToString());
                if (_bkModel != null)
                {
                    using (var httpClientHandler = new HttpClientHandler())
                    {
                        using (var objClient = new HttpClient(httpClientHandler))
                        {
                            objClient.DefaultRequestHeaders.TryAddWithoutValidation("authorization", _bkModel.authToken);
                            objClient.DefaultRequestHeaders.TryAddWithoutValidation("x-app-key", _objCredentials.app_key);

                            string data = "{ " + '"' + "amount" + '"' + ": " + '"' + _bkModel.amount + '"' + ", " + '"' + "intent" + '"' + ": " + '"' + _bkModel.intent + '"' + ", " + '"' + "currency" + '"' + ": " + '"' + _bkModel.currency + '"' + ", " + '"' + "merchantInvoiceNumber" + '"' + ": " + '"' + _bkModel.merchantInvoiceNumber + '"' + " }";
                            var content = new StringContent(data, Encoding.UTF8, "application/json");
                            using (HttpResponseMessage res = await objClient.PostAsync(_objAPIs.createUrl, content))
                            {
                                if (res.IsSuccessStatusCode)
                                {
                                    resdata = res.Content.ReadAsStringAsync().Result;
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception) { }
            return result = new
            {
                resdata
            };
        }

        // POST: api/bKash/executePayment
        [HttpPost("[action]")]
        public async Task<object> executePayment([FromBody]object model)
        {
            object result = null; object resdata = null;
            try
            {
                bKmodel _bkModel = JsonConvert.DeserializeObject<bKmodel>(model.ToString());
                if (_bkModel != null)
                {
                    using (var httpClientHandler = new HttpClientHandler())
                    {
                        using (var objClient = new HttpClient(httpClientHandler))
                        {
                            objClient.DefaultRequestHeaders.TryAddWithoutValidation("authorization", _bkModel.authToken);
                            objClient.DefaultRequestHeaders.TryAddWithoutValidation("x-app-key", _objCredentials.app_key);

                            string _exucuteUrl = _objAPIs.exucuteUrl + "/" + _bkModel.paymentID;
                            using (HttpResponseMessage res = await objClient.PostAsync(_exucuteUrl, null))
                            {
                                if (res.IsSuccessStatusCode)
                                {
                                    resdata = res.Content.ReadAsStringAsync().Result;
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception) { }
            return result = new
            {
                resdata
            };
        }

        // POST: api/bKash/savePayment
        [HttpPost("[action]")]
        public async Task<object> savePayment([FromBody]object model)
        {
            object result = null; object resdata = null;
            try
            {
                bKmodel _bkModel = JsonConvert.DeserializeObject<bKmodel>(model.ToString());
                if (_bkModel != null)
                {
                    //Save To database
                    resdata = "Transaction Saved!";
                }
            }
            catch (Exception) { }
            return result = new
            {
                resdata
            };

        }
    }
}