# bKashPGWCheckout-Angular8_ASP.NetCoreWebAPI
bKash PGW : Checkout – Angular8, ASP.Net Core WebAPI

The Basic Flow:
Create Grant token by calling token API
Then call create payment API with information
Then invoke bKash wallet authentication iframe
Pass the authentication by providing Wallet number, OTP and PIN
Get a callback in execute
Then call execute API
