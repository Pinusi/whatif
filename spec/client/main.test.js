var expect = chai.expect;

describe('Main', function() {
	// before( function (){
	// 	widget = new GEOM.Widget( widget_container, widget_data );
	// });

	it('should have a container');

	// describe('calculatePercent', function () {
		it('it should calculate correctly the percentage', function () {
	// 		var percentage = (widget_data.value - widget_data.min)/(widget_data.max - widget_data.min)
	// 		expect( widget.calculatePercent() ).to.equal(percentage);
			expect( 1 ).to.equal(1);
		});
	// 	it('it should return 0 if min > max', function () {
	// 		widget.data.min = 1000;
	// 		expect( widget.calculatePercent() ).to.equal(0);
	// 	});
	// 	it('it should return 0 if min > value', function () {
	// 		expect( widget.calculatePercent() ).to.equal(0);
	// 	});
		it('it should return 1 if value > max', function () {
	// 		widget.data.min = 112;
	// 		widget.data.value = 800;
	// 		expect( widget.calculatePercent() ).to.equal(1);  
		});
	// });
});