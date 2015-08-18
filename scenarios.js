'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('my app', function() {

  beforeEach(function() {
    //browser.get('app/index.html');
    //browser.get('https://builtwith.angularjs.org/');
   browser.driver.get('https://accountdra.labwebapp.com/interfaces/reseller/frontend/Login.aspx');
  });

    it('should test for a succsessful login checking key features in the login page', function() {
       var loginURL = browser.driver.getCurrentUrl();
       //sends all of the credentials
       browser.driver.findElement(by.name('x_login')).sendKeys('r%397A97381O13681hja');
       browser.driver.findElement(by.name('x_password')).sendKeys('Authnet101');
      //submits the credentials
       browser.driver.findElement(by.id('Submit')).click();
      //checks if Edit Merchat is present to confirm is successfully loged in
       expect(browser.driver.findElement(by.id('menu_lblEditMerchant')).isDisplayed()).toBeTruthy();
      //checks if the "Welcome to the Authorize.net Reseller interface" slogan is present to confirm successfully login
       expect(browser.driver.findElement(by.xpath('//*[@id="Table2"]/tbody/tr/td/b')).isDisplayed()).toBeTruthy();
      //checks to see that once logged in, the URL is not the same as the login page. It should now be the dashboard page
       expect(browser.driver.getCurrentUrl()).not.toEqual(loginURL);
      //checks to see if the log out button is present to confirm a succsessful login
       expect(browser.driver.findElement(by.id('menu_imgbtnLogout')).isDisplayed()).toBeTruthy();
      //pauses so that we can see the information being plugged in
      browser.pause();



    });


});
