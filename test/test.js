describe("A suite", function() {

	beforeEach(function() {
    browser().navigateTo('/');
  });

  it('should automatically redirect to landing page when location hash/fragment is empty', function() {
                expect(browser().location().url()).toBe("/");
            });
});

//Test Login Module
/*describe("Test Controler", function() {

    beforeEach(module('loginModule'));

	var $controller;

    beforeEach(inject(function(_$controller_){
    
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    }));

    describe('loginCtrl', function() {

        it('Check Val', function() {
        
            var $scope = {};
            //var controller = $controller('loginCtrl', { $scope: $scope });

            var test = $scope.hello;

            expect(test).toEqual('testing');
        });
    });
}); */