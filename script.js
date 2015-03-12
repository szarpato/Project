/**
 * @author RadekSz
 * @date 16 II 2014
 */
var version = "0.22";
var resizable_width = 700;
var resizable_height = 500;
var default_canvas_height = 435;
$(function() {
	var resizeTimer;
	$(".main_container").resizable({
			minHeight: 500, 
			minWidth: 700, 
			resize: function(event, ui){
						clearTimeout(resizeTimer);
						resizeTimer = setTimeout(resize_svg(event, ui), 100);
					}
       		});
       		
function resize_svg(event, ui) {
			d3.select(".main_container svg").attr("width", ui.size.width).attr("height", ui.size.height-65);
			svg_sidebars.select("rect:nth-of-type(2)").attr("x", ui.size.width-30);
			svg_sidebars.select("line")
				.attr("y1", ui.size.height-65)
				.attr("y2", ui.size.height-65)
				.attr("x2", ui.size.width-30);
			svg_side_metrics.selectAll("g[name=sidebar_right_all_seq]").attr("transform", "translate(" + (ui.size.width-30)  + ")");
			d3.select("[name=right_up]").attr("transform", "translate(" + (ui.size.width-700)  + ")");
			d3.select("[name=right_down]").attr("transform", "translate(" + (ui.size.width-700)  + ", " + (ui.size.height-500)  + ")");
			d3.select("[name=left_down]").attr("transform", "translate(0 , " + (ui.size.height-500)  + ")");
			d3.select("#clipgrid path").attr("transform", "translate(30, 0)scale(1 , " + (ui.size.height/default_canvas_height)  + ")");
			svgGrid.select("rect:nth-of-type(1)").attr("transform", "translate(0, 0)scale(1 , " + (ui.size.height/default_canvas_height)  + ")");
			svgGrid.select("rect:nth-of-type(2)").attr("transform", "translate(0, 0)scale(1 , " + (ui.size.height/default_canvas_height)  + ")");
			svg_init.select("#clipselection rect").attr("width", (ui.size.width-61));
			d3.select("#side_container").style("height", (ui.size.height-97)+"px").style("clip", "rect(0px 430px " + (ui.size.height-96)+"px 0px");
			resizable_width = ui.size.width;
			resizable_height = ui.size.height;
			drawing_canvas_heigth = resizable_height - 65;
}  
});

	d3.select(".main_container").append("div").style("position", "relative").style("overflow", "auto").style("float", "left").style("margin-top", "2px").style("margin-bottom", "2px")
											  .style("left", "15px").style("height", "36px").style("width", "36px").style("background-color", "red").on('click', delSelection);
																 
	d3.select(".main_container").append("div").style("position", "relative").style("overflow", "auto").style("float", "left").style("margin-top", "2px").style("margin-bottom", "2px")
											  .style("left", "15px").style("height", "36px").style("width", "36px").style("background-color", "green").on('click', showSidebar);
											  
	

var svg_init = d3.select(".main_container").append("svg").style("position", "relative").attr("shape-rendering", "crispEdges").style("background-color", "gray").attr("width", 700).attr("height", 435);
			            
var svg = svg_init.call(d3.behavior.zoom().on("zoom", scroll)).append("g").attr("name", "canvas").call(d3.behavior.drag().on("drag", dragmove));

var svgGrid = svg.append("g").attr("name", "grid");

var svg_sidebars = d3.select(".main_container svg").append("g").attr("name", "svg_sidebar");

var svg_side_metrics = d3.select(".main_container svg").append("g").attr("name", "sidebar_handlers");   
   
var svg_up_down_buttons = d3.select(".main_container svg").append("g").attr("name", "svg_up_down_sidebar_buttons"); 

	svg_init.append("rect").attr("x", -1).attr("y", 0).attr("width", "101%").attr("height", 30).attr("fill", "rgb(240,240,240)").attr("stroke", "black");
			
	svg_init.append("line").attr("x1", 0).attr("y1", 0).attr("x2", "101%").attr("y2", 0).attr("stroke", "black").attr("stroke-width", 2);				

var metric_group = svg_init.append("g").attr('name', 'metrics').attr('cursor', 'default').attr('id', 'metrics_container').on('mousemove',  seqSelection).call(d3.behavior.zoom().on("zoom", seqSelectionScroll))
																						 .on('mouseover', showSelection).on('mouseout', hideSelection);

var metric_group_rect = metric_group.append("rect").attr("x", 30).attr("y", 0).attr("width", 0).attr("height", 30).attr("fill", "rgb(240,240,240)");
									
var tenth_metric_group = metric_group.append("g").attr("name", "tenth_metric");
										 										  
var selection_path = metric_group.append("path").attr("stroke", "black");

var selection_group = svg.append("g").attr('name', 'selection').attr('cursor', 'default').append("rect")
										  /*.attr("clip-path", "url(#clipselection)")*/
										  .attr("x", 30)
										  .attr("y", 30)
										  .attr("width", 20)
										  .attr("height", "100%")
										  .attr("fill", "#E2F4FB")
										  .attr("fill-opacity", 0.4)
										  .attr("opacity", 0)
										  .attr("stroke", "#0099CC")
										  .attr("stroke-width", 1).on('mouseout', hideSelection);
										  										  
	/*d3.select("g[name=selection]").append("clipPath").attr("id", "clipselection").append("rect").attr("x", 31).attr("y", 30).attr("height", "100%").attr("width", (resizable_width-61));*/
										  	
var console_text = d3.select(".main_container").append("div").style("position", "relative").style("overflow", "auto").style("float", "left").style("top", "-2px").style("left", "15px")
															 .style("font-family", "robotoregular, sans-serif").style("width", "500").style("font-size", "14px").text('');
					              							 
var version_text = d3.select(".main_container").append("div").style("position", "relative").style("overflow", "auto").style("float", "right").style("top", "-2px").style("right", "15px")
															 .style("font-family", "robotoregular, sans-serif").style("font-size", "14px").html("<b>GenomeViewer </b>v" + version);
	/*dodaje boczne paski*/
	svg_sidebars.append("rect").attr("x", -1).attr("y", 30).attr("width", 31).attr("height", "101%").attr("fill", "white").attr("stroke", "black");			
	svg_sidebars.append("rect").attr("x", 670).attr("y", 30).attr("width", 31).attr("height", "101%").attr("fill", "white").attr("stroke", "black");				
	svg_sidebars.append("line").attr("x1", 30).attr("y1", 435).attr("x2", 670).attr("y2", 435).attr("stroke", "black").attr("stroke-width", 2);
	
	d3.select(".main_container").append("div").attr("id", "side_container").style("position", "absolute").style("overflow", "auto").style("float", "left").style("top", "70px").style("left", "30px")
											  .style("height", "403px").style("width", "399px").style("border", "1px solid black").style("display", "none").style("background-color", "white")
											  .style("box-shadow", "0 0px 25px 5px rgba(0, 0, 0, 0.25)").style("clip", "rect(0px 430px 404px 0px)");
											  
function showSidebar(){
	$(function(){
		$("#side_container").toggle();
	});
};
	
var scrool_event = 0;
function scroll() {	
	if (d3.event.sourceEvent.deltaY){
		//scrool right
		if (d3.event.sourceEvent.deltaY > 0){
			scrool_event = scrool_event + 60;
			update_and_load_seq("right");
		}
		//scrool left
		else if(d3.event.sourceEvent.deltaY < 0){
			scrool_event = scrool_event - 60;
			update_and_load_seq("left");
		}
	}
	svg.attr("transform", "translate(" + scrool_event  + ")");
	metric_group.attr("transform", "translate(" + scrool_event  + ")");
	/*d3.select("g[name=selection]").attr("transform", "translate(" + scrool_event  + ")");
	d3.select("#clipselection rect").attr("transform", "translate(" + (-scrool_event)  + ")");*/
}

var selectionRect = d3.select("g[name=selection] rect");
var selectionActive = false;  
var path_stranded = selection_path.node();
var p;
var l;
var bisect = d3.bisector(function(d) { return d[0];}).right;
var select_left_boundary = 0;
var select_width = 0;
var select_right_boundary = 0;

function seqSelectionPoint(mousePosition){
	p = path_stranded.getPointAtLength((mousePosition));
	l = path_stranded.getTotalLength();
	var item = points[bisect(points, (p.x))];
	if(typeof(item) === "undefined"){
	  item = [(l+30), 0];
	}
	return item;
}

function seqSelection() {
	if(selectionActive === false){
		var item = seqSelectionPoint((d3.mouse(d3.select("#metrics_container").node())[0])-30);
	  	selectionRect.attr("x", (item[0]-20));
	  	d3.select("g[name=resize_w]").attr("transform", "translate(" + (item[0]-20)  + ")");
	  	d3.select("g[name=resize_e]").attr("transform", "translate(" + (item[0])  + ")");
	 	d3.select("rect[name=selection_on_metrics]").attr("x", (item[0]-20));
	 	console_text.text('Nucleotide index number: ' + Math.ceil((item[0]-30)/20));
	 	select_left_boundary = ((Math.ceil((item[0]-30)/20)*20)+40)-30;
	 	select_right_boundary = select_left_boundary+20;
	 	select_width = select_right_boundary - select_left_boundary+20;
	}
}

function seqSelectionScroll() {
	if(selectionActive === false){
		if (d3.event.sourceEvent.deltaY){
			if (d3.event.sourceEvent.deltaY > 0){
					p = path_stranded.getPointAtLength((d3.mouse(this)[0])-90);
				}
				else if(d3.event.sourceEvent.deltaY < 0){
					p = path_stranded.getPointAtLength((d3.mouse(this)[0])+30);
				}
		}
	  	var item = points[bisect(points, (p.x))];
	  	select_left_boundary = item[0]-20;
	  	select_right_boundary = item[0];
	  	selectionRect.attr("x", select_left_boundary);
	 	d3.select("rect[name=selection_on_metrics]").attr("x", select_left_boundary);
	 	d3.select("g[name=resize_w]").attr("transform", "translate(" + select_left_boundary  + ")");
	  	d3.select("g[name=resize_e]").attr("transform", "translate(" + select_right_boundary  + ")");
	 	console_text.text('Nucleotide index number: ' + Math.ceil((item[0]-30)/20));
 	}
};

function seqSelectionResizeRight() {
	var item = seqSelectionPoint((d3.mouse(d3.select("#metrics_container").node())[0])-40);
	select_right_boundary = item[0];
	if(select_left_boundary == 0){
		select_left_boundary = select_right_boundary - 20;
	}
	var select_width_updated = select_right_boundary - select_left_boundary;
	if(select_width_updated <= 0){
		select_width_updated = 20;
		item = [(select_left_boundary+20), 0];
	}	
	d3.select("rect[name=selection_on_metrics]").attr("width", select_width_updated);
	selectionRect.attr("width", select_width_updated);
	d3.select("g[name=resize_e]").attr("transform", "translate(" + (item[0])  + ")");
	d3.selectAll("rect[name=rectPartSeq]").attr("width", select_width_updated).attr("x", select_left_boundary);
	select_right_boundary = item[0];
};

function seqSelectionResizeLeft() {
	var item = seqSelectionPoint((d3.mouse(d3.select("#metrics_container").node())[0])-40);
	select_left_boundary = item[0];
	var select_width_updated = select_right_boundary - select_left_boundary;
	if(select_width_updated <= 0){
		select_width_updated = 20;
		item = [(select_right_boundary-20), 0];
	}
	d3.select("rect[name=selection_on_metrics]").attr("width", select_width_updated).attr("x", item[0]);
	selectionRect.attr("width", select_width_updated).attr("x", item[0]);
	d3.select("g[name=resize_w]").attr("transform", "translate(" + (item[0])  + ")");
	d3.selectAll("rect[name=rectPartSeq]").attr("width", select_width_updated).attr("x", item[0]);
	select_left_boundary = item[0];
};

var prevXDragSelection = -1;
function updateSelectionMovePos(){
	prevXDragSelection = (seqSelectionPoint((d3.mouse(d3.select("#metrics_container").node())[0])-40))[0];
}

function seqSelectionMove(){
	if(selectionActive === true){
		if(prevXDragSelection == -1) {
			prevXDragSelection = (seqSelectionPoint((d3.mouse(d3.select("#metrics_container").node())[0])-40))[0];    
	    }
	    // dragged left
	    if(d3.event.dx < 0) {
	    	var diff = (prevXDragSelection - (seqSelectionPoint((d3.mouse(d3.select("#metrics_container").node())[0])-40))[0]);
	    	if((select_left_boundary-diff) <= 10){
	    		select_left_boundary;
	    		select_right_boundary;
	    	}
	    	else if((select_left_boundary-diff) > 0){
	    		select_left_boundary = select_left_boundary - diff;
	    		select_right_boundary = select_right_boundary - diff;
	    	}
	    	selectionRect.attr("x", select_left_boundary);
		 	d3.select("rect[name=selection_on_metrics]").attr("x", select_left_boundary);
		 	d3.select("g[name=resize_w]").attr("transform", "translate(" + select_left_boundary  + ")");
		 	d3.select("g[name=resize_e]").attr("transform", "translate(" + select_right_boundary  + ")");
		 	d3.selectAll("rect[name=rectPartSeq]").attr("x", select_left_boundary);
	    }
	    // dragged right
	    else if(d3.event.dx > 0) {
	    	l = path_stranded.getTotalLength();
	    	var diff = (seqSelectionPoint((d3.mouse(d3.select("#metrics_container").node())[0])-40))[0] - prevXDragSelection;	    	
	    	if((select_right_boundary) < (l+30)){
	    		select_left_boundary = select_left_boundary + diff;
	    		select_right_boundary = select_right_boundary + diff;
	    	}
	    	selectionRect.attr("x", select_left_boundary);
		 	d3.select("rect[name=selection_on_metrics]").attr("x", select_left_boundary);
		 	d3.select("g[name=resize_w]").attr("transform", "translate(" + select_left_boundary  + ")");
		 	d3.select("g[name=resize_e]").attr("transform", "translate(" + select_right_boundary  + ")");
		 	d3.selectAll("rect[name=rectPartSeq]").attr("x", select_left_boundary);
	    }
	    prevXDragSelection = (seqSelectionPoint((d3.mouse(d3.select("#metrics_container").node())[0])-40))[0];
	}
}

function showSelection(){
	selectionRect.attr("opacity", 1).attr("fill-opacity", 0.4);
	d3.select("rect[name=selection_on_metrics]").attr("opacity", 1).attr("fill-opacity", 0.4);						
}

function hideSelection(){
	if(selectionActive === false){
		selectionRect.attr("x", select_left_boundary).attr("opacity", 0);
		d3.select("rect[name=selection_on_metrics]").attr("x", select_left_boundary).attr("opacity", 0);
		console_text.text('');
	}								
}

function activateSelection(){
	i = 0;
	posX = (seqSelectionPoint((d3.mouse(d3.select("#metrics_container").node())[0])-30)[0])-20;
	if(seqs.num_selected_all == 0 || num_selected_all == 0){
		while(i < seqs.numSeq){
			seqs[i].select_all = true;
			i++;
		}
		d3.selectAll("rect[name=rectToSelect]").attr("fill", "#8AD5F0").attr("opacity", 1);
		d3.selectAll("rect[name=rectPartSeq]").attr("x", select_left_boundary).attr("opacity", 1);
		d3.selectAll("rect[name=rectToSelectAll]").attr("fill", "#8AD5F0").attr("opacity", 1);
	}
	if(selectionActive === false){
		selectionActive = true;
		selectionRect.attr("opacity", 1).attr("fill", "#8AD5F0").attr("fill-opacity", 0.4).attr("stroke-width", 1);
		d3.select("rect[name=selection_on_metrics]").attr('cursor', 'move').attr("opacity", 1).attr("fill", "#8AD5F0").attr("fill-opacity", 0.4).attr("stroke-width", 1);
		d3.select("g[name=resize_w] rect").style('cursor', 'ew-resize').attr("opacity", 1);
		d3.select("g[name=resize_e] rect").style('cursor', 'ew-resize').attr("opacity", 1);
		d3.selectAll("rect[name=rectPartSeq]").attr("x", posX).attr("width", 20);
	}
}

function delSelection(){
	if(selectionActive === true){
		selectionActive = false;
		select_width = 20;
		selectionRect.attr("opacity", 0).attr("fill", "#E2F4FB").attr("fill-opacity", 0.4).attr("width", select_width);
		d3.select("rect[name=selection_on_metrics]").attr('cursor', 'default').attr("opacity", 0).attr("fill", "#E2F4FB").attr("fill-opacity", 0.4).attr("width", select_width);
		d3.select("g[name=resize_w] rect").style('cursor', 'default').attr("opacity", 0);
		d3.select("g[name=resize_e] rect").style('cursor', 'default').attr("opacity", 0);
		d3.selectAll("rect[name=rectPartSeq]").attr("x", 0).attr("width", (20*max_seq+40));
	}
	var iteration = 0;
	while(iteration < seqs.numSeq){
		if(seqs[iteration].select_all == true){
			console.log("Selected sequence of index number " + iteration + " has been deselected.");
			svg_side_metrics.select("g[name=sidebar_right_seq" + iteration +"] rect").attr("opacity", 0).attr("fill", "#E2F4FB").attr("stroke", "#0099CC");
			svg_side_metrics.select("g[name=sidebar_left_seq" + iteration +"] rect").attr("opacity", 0).attr("fill", "#E2F4FB").attr("stroke", "#0099CC");
			d3.select("g[name=seq]:nth-of-type(" + (iteration+1) +") rect").attr("opacity", 0).attr("fill", "#E2F4FB").attr("stroke", "#0099CC");
			seqs[iteration].select_all = false;
		}
		iteration++;
	seqs['num_selected_all'] = 0;
	} 
}


var prevX = -1; 
function dragmove(d) {
	if(prevX == -1) {
		prevX = d3.event.dx; 
    }
    // dragged left
    if(prevX > d3.event.dx) {
    	/*var delta_drag = 0;
    	delta_drag = prevX - d3.event.sourceEvent.x;*/
    	scrool_event = scrool_event + d3.event.dx;
		svg.attr("transform", "translate(" + scrool_event  + ")");
		metric_group.attr("transform", "translate(" + scrool_event  + ")");
		/*d3.select("g[name=selection]").attr("transform", "translate(" + scrool_event  + ")");*/
		if(d3.event.dx < 0){
			update_and_load_seq("left");
		}
		else if(d3.event.dx > 0){
			update_and_load_seq("right");
		}
    }
    // dragged right
    else if(prevX < d3.event.dx) {
    	scrool_event = scrool_event + d3.event.dx; 
    	metric_group.attr("transform", "translate(" + scrool_event  + ")");
		/*d3.select("g[name=selection]").attr("transform", "translate(" + scrool_event  + ")");*/
    	svg.attr("transform", "translate(" + scrool_event  + ")");
    	update_and_load_seq("right");
    }
    prevX = d3.event.sourceEvent.pageX;
}

var drawing_canvas_heigth = resizable_height-65;
var content_height = 72; //ulega zmianie po dodaniu nowej sekwencji (dodaje 70)
var scrooled = 0;
var scrool_up = function(){
	if(content_height > (drawing_canvas_heigth+scrooled) && (content_height - (drawing_canvas_heigth+scrooled)) >= 10){
		scrooled += 10;
		d3.select("g[name=all_seq]").attr("transform", "translate(0, " + (-scrooled) + ")");
		d3.select("g[name=sidebar_handlers]").attr("transform", "translate(0, " + (-scrooled) + ")");
	}
	else if((content_height - (drawing_canvas_heigth+scrooled)) < 10 && (content_height - (drawing_canvas_heigth+scrooled)) > 0){
		scrooled += (content_height - (drawing_canvas_heigth+scrooled));
		d3.select("g[name=all_seq]").attr("transform", "translate(0, " + ((-scrooled)-(content_height - (drawing_canvas_heigth+scrooled))) + ")");
		d3.select("g[name=sidebar_handlers]").attr("transform", "translate(0, " + ((-scrooled)-(content_height - (drawing_canvas_heigth+scrooled))) + ")");
	}
};

var scrool_down = function(){
	if((drawing_canvas_heigth+scrooled) != drawing_canvas_heigth && scrooled > 10){
		scrooled -= 10;
		d3.select("g[name=all_seq]").attr("transform", "translate(0, " + (-scrooled) + ")");
		d3.select("g[name=sidebar_handlers]").attr("transform", "translate(0, " + (-scrooled) + ")");
	}
	else if(scrooled <= 10 && scrooled >= 0){
		scrooled = 0;
		d3.select("g[name=all_seq]").attr("transform", "translate(0, 0)");
		d3.select("g[name=sidebar_handlers]").attr("transform", "translate(0, 0)");
	}
};

function update_and_load_seq(direction){
	//jeżeli przesunięcie jest wieksze od 400px i przesuwam w lewo
	if(-scrool_event > 400 && direction == "left"){
		console.log("prekroczyłem 400px po lewej stronie");
	}
		//nowy_int_200px-przesunięcia = int((przesuniecie-400)/200)
		//jeżeli nowy_int > star_int
			//odejmij 200px z widocznego zakresu po lewej
			//dodaj 200px do prawej strony zakresu
			//staryint = nowy_int
	//jeżeli przesuniecie jest mniejsze niż max_seq-400px i przesuwam w prawo
	if( max_seq > ((-scrool_event) + resizable_width + 400) && direction == "right"){
		console.log("prekroczyłem 400px po prawej stronie");
	}
		//nowy_int_200px-przesunięcia = int((przesuniecie-400)/200)
		//jeżeli nowy_int < star_int
			//odejmij 200px z widocznego zakresu po prawej
			//dodaj 200px do lewej strony zakresu
			//staryint = nowy_int
	
	
	//jeżeli przesunięcie jest wieksze od 400 oraz mniejsze od -800
		//dodaj 400px siatki po prawej stronie i odejmij 400 px po lewej
	//jeżeli -przesuniecie jest mniejsze od max_seq i -przesunięcie-max_seq jest więsze od -800
	
	
	//dla każdej sekwencji
		//jeżeli sekwencja jest dłuższa od aktualnego przesunięcia
			//jeżeli przesunięcie do przodu
				//jeżeli nie koniec to załaduj kolejny fragment
				//jeżeli koniec załaduje brakujący fragment
			//jeżeli przesunięcie do tyłu
				//jeżeli nie koniec to załaduj kolejny fragment
				//jeżeli koniec załaduje brakujący fragment
		//jeżeli sekwencja krótsza od aktualnego przesunięcia to nie ładuj jej dalej
};

var num_selected_all = 0;

var select_all_seq = function(index_seq){
	if(seqs[index_seq].select_all == false){
		console.log("Selected sequence has index number " + index_seq);
		svg_side_metrics.select("g[name=sidebar_right_seq" + index_seq +"] rect")
				.attr("opacity", 1).attr("fill", "#8AD5F0").attr("stroke", "#0099CC");
		svg_side_metrics.select("g[name=sidebar_left_seq" + index_seq +"] rect")
				.attr("opacity", 1).attr("fill", "#8AD5F0").attr("stroke", "#0099CC");
		d3.select("g[name=seq]:nth-of-type(" + (index_seq+1) +") rect").attr("opacity", 1).attr("fill", "#8AD5F0").attr("stroke", "#0099CC");
		seqs[index_seq].select_all = true;
		num_selected_all++;
		seqs['num_selected_all'] = num_selected_all;
	}
	else{
		console.log("Deselected sequence has index number " + index_seq);
		svg_side_metrics.select("g[name=sidebar_right_seq" + index_seq +"] rect")
				.attr("opacity", 0).attr("fill", "#E2F4FB").attr("stroke", "#0099CC");
		svg_side_metrics.select("g[name=sidebar_left_seq" + index_seq +"] rect")
				.attr("opacity", 0).attr("fill", "#E2F4FB").attr("stroke", "#0099CC");
		d3.select("g[name=seq]:nth-of-type(" + (index_seq+1) +") rect").attr("opacity", 0).attr("fill", "#E2F4FB").attr("stroke", "#0099CC");
		seqs[index_seq].select_all = false;
		num_selected_all = num_selected_all-1;
		seqs['num_selected_all'] = num_selected_all;
	}										
}


var max_seq = 0;
var seqs = {"numSeq": 0};
var addSequence = function(seq){
	var len_seq = seq.length;
	seqs[seqs.numSeq] = {"sequence": seq, "len": len_seq, "select_all": false};
	//gdy dotychcasowa sekwencja była równa 0
	if(max_seq == 0){
		createDefsy();
		//jeżeli nowa sekwencja jest mniejsza od szerokości widgetu * 800px to dodaj ją w całości od początku
		if(len_seq*20 < (resizable_width+800)){
			createGrid(0, len_seq);
			seqMetrics(0, len_seq, len_seq*20, len_seq);
			//dodaje przesunetą grupę seq zawierającą obie nici
			d3.select("g[name=all_seq]").append("g").attr("name", "seq").attr("transform", "translate(0, " + (70*seqs.numSeq+52) + ")");
			addStrandSeqeunce(30, seq, len_seq, 1);
			var compStrand = complementStrand(seq, len_seq);
			addStrandSeqeunce(30, compStrand, len_seq, 2);
		}
		//jezęli jest jdnak większa lub równa to dodaj od początku tylko taką dłogość która jest równa szerokości okna + 800px i jest podzielna bez reszty w dół przez 20
		else{
			createGrid(0, Math.ceil((resizable_width+800)/20));
			seqMetrics(0, Math.ceil((resizable_width+800)/20), Math.ceil((resizable_width+800)/20)*20, len_seq);
			d3.select("g[name=all_seq]").append("g").attr("name", "seq").attr("transform", "translate(0, " + (70*seqs.numSeq+52) + ")");
			addStrandSeqeunce(30, seq.substring(0, Math.ceil((resizable_width+800)/20)+1), Math.ceil((resizable_width+800)/20), 1);
			var compStrand = complementStrand(seq.substring(0, Math.ceil((resizable_width+800)/20)+1), Math.ceil((resizable_width+800)/20));
			addStrandSeqeunce(30, compStrand, Math.ceil((resizable_width+800)/20), 2);
		}
		max_seq = len_seq;
	}
	// gdy nowa sekwencja jest większa od najdłuższej dotychczasowej a ta najdłuższa nie była = 0
	else if(len_seq > max_seq && max_seq != 0){
		//jeżeli nowa sekwencja jest DŁUŻSZA LUB RÓWNA od przesunięcia + długość okna + 400px (podzielne bez reszty przez 20)
		if(len_seq >= Math.ceil((-scrool_event+resizable_width+400)/20)){
			//jeżeli przeunięcia jest większe lub równe 400 to dodaj nową sekwencję od przesunięcia - 400px aż do szerokość okna + 400px
			if(scrool_event <= -400){
				createGrid(Math.ceil((-scrool_event-400)/20), Math.ceil((-scrool_event+resizable_width+400)/20));
				seqMetrics(Math.ceil((-scrool_event-400)/20), Math.ceil((-scrool_event+resizable_width+400)/20), Math.ceil((-scrool_event+resizable_width+400)/20)*20, len_seq);
				d3.select("g[name=all_seq]").append("g").attr("name", "seq").attr("transform", "translate(0, " + (70*seqs.numSeq+52) + ")");
				addStrandSeqeunce(Math.ceil((-scrool_event-400)/20)*20+30, seq.substring(Math.ceil((-scrool_event-400)/20), Math.ceil((-scrool_event+resizable_width+400)/20)+1), Math.ceil((resizable_width+800)/20), 1);
				var compStrand = complementStrand(seq.substring(Math.ceil((-scrool_event-400)/20), Math.ceil((-scrool_event+resizable_width+400)/20)+1), Math.ceil((resizable_width+800)/20));
				addStrandSeqeunce(Math.ceil((-scrool_event-400)/20)*20+30, compStrand, Math.ceil((resizable_width+800)/20), 2);
			}
			//eżeli przeunięcia jest mniejsze niż 400 to dodaj nową sekwencję od początku aż do szerokość okna + 800px
			else if(scrool_event > -400){
				createGrid(0, Math.ceil((resizable_width+800)/20));
				seqMetrics(0, Math.ceil((resizable_width+800)/20), Math.ceil((resizable_width+800)/20)*20, len_seq);
				d3.select("g[name=all_seq]").append("g").attr("name", "seq").attr("transform", "translate(0, " + (70*seqs.numSeq+52) + ")");
				addStrandSeqeunce(30, seq.substring(0, Math.ceil((resizable_width+800)/20)+1), Math.ceil((resizable_width+800)/20), 1);
				var compStrand = complementStrand(seq.substring(0, Math.ceil((resizable_width+800)/20)+1), Math.ceil((resizable_width+800)/20));
				addStrandSeqeunce(30, compStrand, Math.ceil((resizable_width+800)/20), 2);
			}
		}
		//jeżeli nowa sekwencja jest MNIEJSZA od przesunięcia + długość okna + 400px (podzielne bez reszty przez 20)
		if(len_seq < Math.ceil((-scrool_event+resizable_width+400)/20)){
			//jeżeli dotychczasowa najdłuższa sekwencja - przesunięcie są mniejsze od 400 px to dodaj nową sekwencję od przesunięcia - 400px aż do końca długości sekwencji
			if((max_seq*20)+scrool_event < -400){
				createGrid(Math.ceil((-scrool_event-400)/20), len_seq);
				seqMetrics(Math.ceil((-scrool_event-400)/20), len_seq, len_seq*20, len_seq);
				d3.select("g[name=all_seq]").append("g").attr("name", "seq").attr("transform", "translate(0, " + (70*seqs.numSeq+52) + ")");
				addStrandSeqeunce(Math.ceil((-scrool_event-400)/20)*20+30, seq.substring(Math.ceil((-scrool_event-400)/20), len_seq+1), len_seq-Math.ceil((-scrool_event-400)/20), 1);
				var compStrand = complementStrand(seq.substring(Math.ceil((-scrool_event-400)/20), len_seq+1), len_seq-Math.ceil((-scrool_event-400)/20), len_seq-Math.ceil((-scrool_event-400)/20));
				addStrandSeqeunce(Math.ceil((-scrool_event-400)/20)*20+30, compStrand, len_seq-Math.ceil((-scrool_event-400)/20), 2);
			}
			//jeżeli maksymalna długość sekwencji - przesunięcie jest większa lub równa 400px to dodaj nową sekwencję od początku aż do końca długości sekwencji
			else if((max_seq*20)+scrool_event >= -400){
				createGrid(0, len_seq);
				seqMetrics(0, len_seq, len_seq*20, len_seq);
				d3.select("g[name=all_seq]").append("g").attr("name", "seq").attr("transform", "translate(0, " + (70*seqs.numSeq+52) + ")");
				addStrandSeqeunce(30, seq, len_seq, 1);
				var compStrand = complementStrand(seq, len_seq);
				addStrandSeqeunce(30, compStrand, len_seq, 2);
			}
		}
		max_seq = len_seq;
	}
	// gdy nowa sekwencja jest mniejsza od najdłuższej dotychczasowej
	else{
		//jeżeli nowa sekwencja jest większa lub równa przesunięciu + długość okna + 400px
		if(len_seq >= Math.ceil((-scrool_event+resizable_width+400)/20)){
			//jeżeli przesunięcia jest większe lub równe niż 400px to dodaj nową sekwencję od przesunięcia - 400px do przesunięcie + szerokość okna + 400px
			if(scrool_event <= -400){
				d3.select("g[name=all_seq]").append("g").attr("name", "seq").attr("transform", "translate(0, " + (70*seqs.numSeq+52) + ")");
				addStrandSeqeunce(Math.ceil((-scrool_event-400)/20)*20+30, seq.substring(Math.ceil((-scrool_event-400)/20), Math.ceil((-scrool_event+resizable_width+400)/20)+1), Math.ceil((resizable_width+800)/20), 1);
				var compStrand = complementStrand(seq.substring(Math.ceil((-scrool_event-400)/20), Math.ceil((-scrool_event+resizable_width+400)/20)+1), Math.ceil((resizable_width+800)/20));
				addStrandSeqeunce(Math.ceil((-scrool_event-400)/20)*20+30, compStrand, Math.ceil((resizable_width+800)/20), 2);
			}
			//jeżeli przesunięcia jest mniejsza niż 400px to dodaj nową sekwencję od początku do szerokość okna + 800px
			else if(scrool_event > -400){
				d3.select("g[name=all_seq]").append("g").attr("name", "seq").attr("transform", "translate(0, " + (70*seqs.numSeq+52) + ")");
				addStrandSeqeunce(30, seq.substring(0, Math.ceil((resizable_width+800)/20)+1), Math.ceil((resizable_width+800)/20), 1);
				var compStrand = complementStrand(seq.substring(0, Math.ceil((resizable_width+800)/20)+1), Math.ceil((resizable_width+800)/20));
				addStrandSeqeunce(30, compStrand, Math.ceil((resizable_width+800)/20), 2);
			}
		}
		//jeżeli nowa sekwencja jest mniejsza od przesunięcia + długość okna + 400px
		if(len_seq < Math.ceil((-scrool_event+resizable_width+400)/20)){
			//jeżeli dotychczasowa najdłuższa sekwencja - przesunięcie są mniejsze od 400 px to dodaj nową sekwencję od przesunięcia - 400px aż do końca długości sekwencji
			if((max_seq*20)+scrool_event < -400){
				d3.select("g[name=all_seq]").append("g").attr("name", "seq").attr("transform", "translate(0, " + (70*seqs.numSeq+52) + ")");
				addStrandSeqeunce(Math.ceil((-scrool_event-400)/20)*20+30, seq.substring(Math.ceil((-scrool_event-400)/20), len_seq+1), len_seq-Math.ceil((-scrool_event-400)/20), 1);
				var compStrand = complementStrand(seq.substring(Math.ceil((-scrool_event-400)/20), len_seq+1), len_seq-Math.ceil((-scrool_event-400)/20), len_seq-Math.ceil((-scrool_event-400)/20));
				addStrandSeqeunce(Math.ceil((-scrool_event-400)/20)*20+30, compStrand, len_seq-Math.ceil((-scrool_event-400)/20), 2);
			}
			//jeżeli maksymalna długość sekwencji - przesunięcie jest większa lub równa 400px to dodaj nową sekwencję od początku aż do końca długości sekwencji
			else if((max_seq*20)+scrool_event >= -400){
				d3.select("g[name=all_seq]").append("g").attr("name", "seq").attr("transform", "translate(0, " + (70*seqs.numSeq+52) + ")");
				addStrandSeqeunce(30, seq, len_seq, 1);
				var compStrand = complementStrand(seq, len_seq);
				addStrandSeqeunce(30, compStrand, len_seq, 2);
			}
		}
	}
	
	//prostokąt do zaznaczania całościowego i częściowego z clipping path
	d3.select("g[name=seq]:last-of-type").append("rect").attr("name", "rectToSelectAll").attr("clip-path", "url(#partialSelection)").attr("x", 25).attr("y", 1).attr("width", (20*len_seq+11))
										 .attr("height", 53).attr("fill-opacity", 0.3).attr("fill", "#E2F4FB").attr("opacity", 0).attr("stroke", "#0099CC").attr("stroke-width", 2);
	
	content_height += 70;
	if(seqs.hasOwnProperty("numSeq")){
		seqs["numSeq"]++;
	}
};

var metrics_created = false; 
/*dodaje siatkę szaro-ajsnych szaro-ciemnych prostokątów*/
var createGrid = function(start, numGrid){
	//OZNACZENIE: var svgGrid = svg.append("g").attr("name", "grid");
	//aktualizuje wzór tła	
	var i = start;
	var pattern = '';													
	while(i < numGrid){
		if(i%2==0){
			pattern = pattern + ' M ' + (i*20+30) + ' 0 ';
		}
		i++;
	}
	
	if(metrics_created === true){
		svgGrid.select("rect:nth-of-type(1)").attr("width", 20*numGrid);
		d3.select("path[name=gridPath").attr('d', pattern);	
	}
	
	if(metrics_created === false){
		//rysuje dwa prostokąty i ścieżkę na podstawie markerów
		svgGrid.append("rect").attr("x", 30).attr("y", 0).attr("width", 20*numGrid).attr("height", default_canvas_height).attr("fill", "rgb(220,220,220)").attr("stroke-width", 0);		
		svgGrid.append("path").attr("name", "gridPath").attr("marker-start", "url(#grid_marker)").attr("marker-mid", "url(#grid_marker)").attr("marker-end", "url(#grid_marker)").attr('d', pattern);								                  
	}
};

function createDefsy(){
		//tworzy grupę dla wszysrkich sekewncji		
		svg.append("g").attr("name", "all_seq").attr("transform", "translate(0, 0)");
		//tworzy maskę dla sekwencji podczas zanznaczania częściowego
		svg.append("clipPath").attr("id", "partialSelection").append("rect").attr("name", "rectPartSeq").attr("x", 0).attr("y", 0).attr("width", (20*max_seq+35)).attr("height", "100%");
		//wszystkie definicje
		var defsy = svg.append("defs");
		
		var strand_marker_A = defsy.append("marker").attr("id", "marker_A").attr("markerWidth", 22).attr("markerHeight", 22).attr("refx", 10).attr("refy", 10).attr("orient", 0).append("g");
		strand_marker_A.append("rect").attr("x", 0).attr("y", 1).attr("width", 20).attr("height", 20).attr("fill", "#F83A3A").attr("stroke", "black");					  
		strand_marker_A.append('text').text('A').attr("text-anchor", "middle").attr('x', 10).attr('y', 18).attr('fill', 'black').attr("font-family", "robotoregular, sans-serif")
									  .attr("font-size", "18px").attr('cursor', 'default');		                  
		var strand_marker_T = defsy.append("marker").attr("id", "marker_T").attr("markerWidth", 22).attr("markerHeight", 22).attr("refx", 10).attr("refy", 10).attr("orient", 0).append("g");
		strand_marker_T.append("rect").attr("x", 0).attr("y", 1).attr("width", 20).attr("height", 20).attr("fill", "#92C500").attr("stroke", "black");				  
		strand_marker_T.append('text').text('T').attr("text-anchor", "middle").attr('x', 10).attr('y', 18).attr('fill', 'black').attr("font-family", "robotoregular, sans-serif")
					              	  .attr("font-size", "18px").attr('cursor', 'default');		                  
		var strand_marker_C = defsy.append("marker").attr("id", "marker_C").attr("markerWidth", 22).attr("markerHeight", 22).attr("refx", 10).attr("refy", 10).attr("orient", 0).append("g");
		strand_marker_C.append("rect").attr("x", 0).attr("y", 1).attr("width", 20).attr("height", 20).attr("fill", "#2CB1E1").attr("stroke", "black");		  
		strand_marker_C.append('text').text('C').attr("text-anchor", "middle").attr('x', 10).attr('y', 18).attr('fill', 'black').attr("font-family", "robotoregular, sans-serif")
					                  .attr("font-size", "18px").attr('cursor', 'default');	                  
		var strand_marker_G = defsy.append("marker").attr("id", "marker_G").attr("markerWidth", 22).attr("markerHeight", 22).attr("refx", 10).attr("refy", 10).attr("orient", 0).append("g");
		strand_marker_G.append("rect").attr("x", 0).attr("y", 1).attr("width", 20).attr("height", 20).attr("fill", "#FFBD21").attr("stroke", "black");
		strand_marker_G.append('text').text('G').attr("text-anchor", "middle").attr('x', 10).attr('y', 18).attr('fill', 'black').attr("font-family", "robotoregular, sans-serif")
					                  .attr("font-size", "18px").attr('cursor', 'default');
		var metric_marker = defsy.append("marker").attr("id", "metric_marker").attr("markerWidth", 2).attr("markerHeight", 30).attr("refx", 0).attr("refy", 0).attr("orient", 0).append("line")
												  .attr("x1", 0).attr("y1", 22).attr("x2", 0).attr("y2", 30).attr("stroke", "black");
		var grid_marker = defsy.append("marker").attr("id", "grid_marker").attr("markerWidth", 20).attr("markerHeight", "100%").attr("refx", 0).attr("refy", 0).attr("orient", 0).append("rect")
												.attr("width", 20).attr("height", "100%").attr("fill", "rgb(235,235,235)").attr("stroke-width", 0);	
};


var points = [];
/* dodaje linijkę*/
var seqMetrics = function(start, seqLen, grid_width, seqLen2){
	/*creates array of x, y points which are coordinates for metric path*/
	
	if(seqLen2>=max_seq){
		points = [];
		iter = 0;
		while(iter <= seqLen2){
			points.push([((iter*20)+30), 0]);
			iter++;
		}
	}
	/*
	var iter = start;
	points = [];
	if(iter == 0){
		points.push([30, 0]);
		iter++;
	}
	else{
		points.push([30, 0]);
	}
	while(iter <= seqLen){
		points.push([((iter*20)+30), 0]);
		iter++;
	}	*/

	/*creates metric rectangle, line and metric path*/
	if(metrics_created === false){	
		metric_group.append("line").attr("name", "line_on_metrics").attr("x1", 30).attr("y1", 0).attr("x2", grid_width+30).attr("y2", 0).attr("stroke", "black").attr("stroke-width", 2);			
		metric_group_rect.attr("width", grid_width);	
		selection_path.data([points]).attr("d", d3.svg.line()).attr("marker-start", "url(#metric_marker)").attr("marker-mid", "url(#metric_marker)").attr("marker-end", "url(#metric_marker)");			
		//selection_on_metrics
		metric_group.append("rect").attr('name', 'selection_on_metrics').attr('cursor', 'default').attr("x", 30).attr("y", 0).attr("width", 20).attr("height", 30).attr("fill", "#E2F4FB")
					.attr("fill-opacity", 0.4).attr("opacity", 0).attr("stroke", "#0099CC").attr("stroke-width", 1)
					.on('mousedown', updateSelectionMovePos).on('click', activateSelection).call(d3.behavior.drag().on("drag", seqSelectionMove));	
		//lewy handler zaznaczenia		
		metric_group.append("g").attr('name', 'resize_w').style('cursor', 'default').call(d3.behavior.drag().on("drag", seqSelectionResizeLeft))
					.append("rect").attr("x", -3).attr("y", 0).attr("width", 6).attr("height", 30).attr("fill", "#0099CC").attr("opacity", 0).attr("stroke-width", 0);			
		//prawy handler zaznaczenia
		metric_group.append("g").attr('name', 'resize_e').style('cursor', 'default').call(d3.behavior.drag().on("drag", seqSelectionResizeRight))
					.append("rect").attr("x", -3).attr("y", 0).attr("width", 6).attr("height", 30).attr("fill", "#0099CC").attr("opacity", 0).attr("stroke-width", 0);			
		metrics_created = true;
	}
	/*updates width of rectangle and line, as well as points coordintes of path*/
	else{
		metric_group_rect.attr("width", grid_width);	
		d3.select("[name=line_on_metrics]").attr("x2", grid_width+30);
		selection_path.data([points]).attr("d", d3.svg.line());	
	}
	/*creates metric division*/		
	var i = start;
	while(i <= seqLen){
		if(i%10 === 0){
			tenth_metric_group.append("text").text(i).attr("x", 30+20*i).attr("y", 2).attr("text-anchor", "middle").attr("dominant-baseline", "hanging").attr("fill", "black")
											 .attr("font-family", "robotoregular, sans-serif").attr("font-size", "15px");
		    tenth_metric_group.append("line").attr("x1", 30+20*i).attr("y1", 17).attr("x2", 30+20*i).attr("y2", 30).attr("stroke", "black");
		}
		i++;
	}	
};


/*dodaje sekwencję kolorowych bloków*/
var addStrandSeqeunce = function(start, sequence, len_seq, strand){
	
	svg.selectAll("rect[name=rectPartSeq]").attr("x", 0).attr("y", 0).attr("width", (20*max_seq+40));
	 
	var strand_group = svg.selectAll("g[name=seq]:last-child").append("g").attr("name", "strand_" + strand);
	
	var path_A = strand_group.append("path").attr("name", "path_for_A").attr("transform", "translate(" + start + ", 3)")
											.attr("marker-start", "url(#marker_A)").attr("marker-mid", "url(#marker_A)").attr("marker-end", "url(#marker_A)");
	var path_T = strand_group.append("path").attr("name", "path_for_T").attr("transform", "translate(" + start + ", 3)")
											.attr("marker-start", "url(#marker_T)").attr("marker-mid", "url(#marker_T)").attr("marker-end", "url(#marker_T)");		
	var path_C = strand_group.append("path").attr("name", "path_for_C").attr("transform", "translate(" + start + ", 3)")
											.attr("marker-start", "url(#marker_C)").attr("marker-mid", "url(#marker_C)").attr("marker-end", "url(#marker_C)");			
	var path_G = strand_group.append("path").attr("name", "path_for_C").attr("transform", "translate(" + start + ", 3)")
											.attr("marker-start", "url(#marker_G)").attr("marker-mid", "url(#marker_G)").attr("marker-end", "url(#marker_G)");
	var path_A_eq = '';
	var path_T_eq = '';
	var path_C_eq = '';
	var path_G_eq = '';
										
	if(strand === 2){
		strand_group.attr("transform", "translate(0, 26)");
	}
	
	var i = 0;
	while(i < len_seq){
		if(sequence[i] === 'a' || sequence[i] === 'A'){
			path_A_eq = path_A_eq + 'M '+ (i*20) + ' 0 ';
		}
		else if(sequence[i] === 't' || sequence[i] === 'T'){
			path_T_eq = path_T_eq + 'M '+ (i*20) + ' 0 ';
		}
		else if(sequence[i] === 'c' || sequence[i] === 'C'){
			path_C_eq = path_C_eq + 'M '+ (i*20) + ' 0 ';
		}
		else if(sequence[i] === 'g' || sequence[i] === 'G'){
			path_G_eq = path_G_eq + 'M '+ (i*20) + ' 0 ';
		}
		i++;
	}
	path_A.attr("d", path_A_eq);
	path_T.attr("d", path_T_eq);
	path_C.attr("d", path_C_eq);
	path_G.attr("d", path_G_eq);
	/*dodaje oznaczenia końców nici DNA*/
	addSeqHandlers(strand);	
	/*create up and down navigational tools*/
	createScrollbars();
};

/*dodaje oznaczenia końców nici DNA*/
function addSeqHandlers(strand){
	if(strand === 1){
		//lewe oznaczenie końców
		var svg_side_metrics_left_group = svg_side_metrics.append("g").attr("name", "sidebar_left_seq"+ seqs.numSeq).data([{"indexSeq": seqs.numSeq}]).attr("transform", "translate(0, " + (70*seqs.numSeq+53) + ")")
														  .on('mouseover', function(d) { 
																				if(seqs[d.indexSeq].select_all == false){
																					svg_side_metrics.select("g[name=sidebar_left_seq" + d.indexSeq +"] rect").attr("opacity", 1);
																					svg_side_metrics.select("g[name=sidebar_right_seq" + d.indexSeq +"] rect").attr("opacity", 1);
																					d3.select("g[name=seq]:nth-of-type(" + (d.indexSeq+1) +") rect").attr("opacity", 1);
																				}
																		   })
														  .on('mouseout', function(d) { 
																				 if(seqs[d.indexSeq].select_all == false){
																					svg_side_metrics.select("g[name=sidebar_left_seq" + d.indexSeq +"] rect").attr("opacity", 0);
																					svg_side_metrics.select("g[name=sidebar_right_seq" + d.indexSeq +"] rect").attr("opacity", 0);
																					d3.select("g[name=seq]:nth-of-type(" + (d.indexSeq+1) +") rect").attr("opacity", 0);
																				}
																		   })
														  .on('click', function(d){select_all_seq(d.indexSeq);});
													
		svg_side_metrics_left_group.append("rect").attr("clip-path", "url(#clipleft"+ seqs.numSeq+ ")").attr("name", "rectToSelect").attr("x", 6).attr("y", 0).attr("width", 25).attr("height", 53)
												  .attr("fill", "#E2F4FB").attr("fill-opacity", 0.3).attr("opacity", 0).attr("stroke", "#0099CC").attr("stroke-width", 2); 											
		svg_side_metrics_left_group.append("clipPath").attr("id", "clipleft" + seqs.numSeq).append("rect").attr("x", 2).attr("y", -2).attr("height", 56).attr("width", 28);
		//prawe oznaczenie końców											
		var svg_side_metrics_right_group = svg_side_metrics.append("g").attr("name", "sidebar_right_all_seq").attr("transform", "translate(" + (resizable_width-30) + ")")
														  .append("g").attr("name", "sidebar_right_seq" + seqs.numSeq).attr("transform", "translate(0, " + (70*seqs.numSeq+53) + ")")
														  .data([{"indexSeq": seqs.numSeq}])
														  .on('mouseover', function(d) {
																			    if(seqs[d.indexSeq].select_all == false){ 
																				    svg_side_metrics.select("g[name=sidebar_right_seq" + d.indexSeq +"] rect").attr("opacity", 1);
																					svg_side_metrics.select("g[name=sidebar_left_seq" + d.indexSeq +"] rect").attr("opacity", 1);
																					d3.select("g[name=seq]:nth-of-type(" + (d.indexSeq+1) +") rect").attr("opacity", 1);
																				}
																		   })
														  .on('mouseout', function(d) { 
																				if(seqs[d.indexSeq].select_all == false){
																					svg_side_metrics.select("g[name=sidebar_right_seq" + d.indexSeq +"] rect").attr("opacity", 0);
																					svg_side_metrics.select("g[name=sidebar_left_seq" + d.indexSeq +"] rect").attr("opacity", 0);
																					d3.select("g[name=seq]:nth-of-type(" + (d.indexSeq+1) +") rect").attr("opacity", 0);
																				}
																		   })
														  .on('click', function(d){select_all_seq(d.indexSeq);});
														  						
		svg_side_metrics_right_group.append("rect").attr("clip-path", "url(#clipright"+ seqs.numSeq+ ")").attr("name", "rectToSelect").attr("x", 0).attr("y", 0).attr("width", 25).attr("height", 53)
												   .attr("fill", "#E2F4FB").attr("fill-opacity", 0.3).attr("opacity", 0).attr("stroke", "#0099CC").attr("stroke-width", 2);
		svg_side_metrics_right_group.append("clipPath").attr("id", "clipright" + seqs.numSeq).append("rect").attr("x", 0).attr("y", -2).attr("height", 56).attr("width", 27);
		//dodaje kwadraciki dla pierwszej nici z oznaczeniem 3' i 5'
		svg_side_metrics.select("g[name=sidebar_left_seq" + seqs.numSeq + "]").append("rect").attr("x", 10).attr("y", 3).attr("width", 20).attr("height", 20).attr("fill", "rgb(240,240,240)").attr("stroke", "black");		
		svg_side_metrics.select("g[name=sidebar_left_seq" + seqs.numSeq + "]").append('text').text("5'").attr("text-anchor", "middle").attr('x', 20).attr('y', 20).attr('fill', 'black')
																			  .attr("font-family", "robotoregular, sans-serif").attr("font-size", "18px").attr('cursor', 'default');    
        svg_side_metrics.select("g g[name=sidebar_right_seq" + seqs.numSeq + "]").append("rect").attr("x", 0).attr("y", 3).attr("width", 20).attr("height", 20).attr("fill", "rgb(240,240,240)").attr("stroke", "black");         
        svg_side_metrics.select("g g[name=sidebar_right_seq" + seqs.numSeq + "]").append('text').text("3'").attr("text-anchor", "middle").attr('x', 10).attr('y', 20).attr('fill', 'black')
        																		 .attr("font-family", "robotoregular, sans-serif").attr("font-size", "18px").attr('cursor', 'default');
	}
	else if(strand === 2){
		//dodaje kwadraciki dla pierwszej nici z oznaczeniem 3' i 5'
		svg_side_metrics.select("g[name=sidebar_left_seq" + seqs.numSeq + "]").append("rect").attr("x", 10).attr("y", 29).attr("width", 20).attr("height", 20).attr("fill", "rgb(240,240,240)").attr("stroke", "black");
		svg_side_metrics.select("g[name=sidebar_left_seq" + seqs.numSeq + "]").append('text').text("3'").attr("text-anchor", "middle").attr('x', 20).attr('y', 46).attr('fill', 'black')
               																  .attr("font-family", "robotoregular, sans-serif").attr("font-size", "18px").attr('cursor', 'default');
        svg_side_metrics.select("g g[name=sidebar_right_seq" + seqs.numSeq + "]").append("rect").attr("x", 0).attr("y", 29).attr("width", 20).attr("height", 20).attr("fill", "rgb(240,240,240)").attr("stroke", "black");
        svg_side_metrics.select("g g[name=sidebar_right_seq" + seqs.numSeq + "]").append('text').text("5'").attr("text-anchor", "middle").attr('x', 10).attr('y', 46).attr('fill', 'black')
                																 .attr("font-family", "robotoregular, sans-serif").attr("font-size", "18px").attr('cursor', 'default');
	}
};


var up_down_buttons = false;
function createScrollbars(){
	if(up_down_buttons === false){
		var left_up = svg_up_down_buttons.append("g").attr("name", "left_up").on('mouseup', function(){svg_up_down_buttons.select("g[name=left_up] rect").attr("fill", "rgb(240, 240, 240)");})
																			 .on('mousedown', function(){svg_up_down_buttons.select("g[name=left_up] rect").attr("fill", "rgb(190, 190, 190)");})
																			 .on('click', scrool_down);
		left_up.append("rect").attr("x", -1).attr("y", 30).attr("width", 31).attr("height", 20).attr("fill", "rgb(240,240,240)").attr("stroke", "black");
		left_up.append('path').attr('d',  'M 15 34 l 7 13 l -14 0 z');
		
		var right_up = svg_up_down_buttons.append("g").attr("name", "right_up").on('mouseup', function(){svg_up_down_buttons.select("g[name=right_up] rect").attr("fill", "rgb(240, 240, 240)");})
																			   .on('mousedown', function(){svg_up_down_buttons.select("g[name=right_up] rect").attr("fill", "rgb(190, 190, 190)");})
																			   .on('click', scrool_down);
		right_up.append("rect").attr("x", 670).attr("y", 30).attr("width", 31).attr("height", 20).attr("fill", "rgb(240,240,240)").attr("stroke", "black");
		right_up.append('path').attr('d', 'M 686 34 l 7 13 l -14 0 z');
      				
      	var left_down = svg_up_down_buttons.append("g").attr("name", "left_down").on('mouseup', function(){svg_up_down_buttons.select("g[name=left_down] rect").attr("fill", "rgb(240, 240, 240)");})
      																			 .on('mousedown', function(){svg_up_down_buttons.select("g[name=left_down] rect").attr("fill", "rgb(190, 190, 190)");})
      																			 .on('click', scrool_up);					
      	left_down.append("rect").attr("x", -1).attr("y", 414).attr("width", 31).attr("height", 20).attr("fill", "rgb(240,240,240)").attr("stroke", "black");
      	left_down.append('path').attr('d', 'M 15 432 l 7 -13 l -14 0 z');
      	
      	var right_down = svg_up_down_buttons.append("g").attr("name", "right_down").on('mouseup', function(){svg_up_down_buttons.select("g[name=right_down] rect").attr("fill", "rgb(240, 240, 240)");})
      																			   .on('mousedown', function(){svg_up_down_buttons.select("g[name=right_down] rect").attr("fill", "rgb(190, 190, 190)");})
      																			   .on('click', scrool_up);																	 		
		right_down.append("rect").attr("x", 670).attr("y", 414).attr("width", 31).attr("height", 20).attr("fill", "rgb(240,240,240)").attr("stroke", "black");
      	right_down.append('path').attr('d', 'M 686 432 l 7 -13 l -14 0 z');
		up_down_buttons = true;
	}
}

var complementStrand = function(seq, len_seq){
	var newSeq = '';
	var i = 0;
	while(i < len_seq){
		if(seq[i] === 'a' || seq[i] === 'A'){
			newSeq = newSeq + 't';
		}
		else if(seq[i] === 't' || seq[i] === 'T'){
			newSeq = newSeq + 'a';
		}
		else if(seq[i] === 'c' || seq[i] === 'C'){
			newSeq = newSeq + 'g';
		}
		else if(seq[i] === 'g' || seq[i] === 'G'){
			newSeq = newSeq + 'c';
		}
		i++;
	}
	return newSeq;
};


addSequence('actgacccgctcgggagcacacgctcgag');			

addSequence('agtcgtaaaagtctgacgtGCCCTCGCTGTGGGGGGGGGTGGAACCCGCGCCCCGTGGGAAAcccgtgggagagtcgctccactcccactcgcggtgcacaaaaaacacaatatataaatcactgctcggtcgggtgagtcgtaaaagtctgacgtGCCCTCGCTGTGGGGGGGGGTGGAACCCGCGCCCCGTGGGAAAcccgtgggagagtgggtg');

addSequence('agtccccgtgagagcggctcgggtaaaagtctgacgtGCCCTCGCTGTGGGGGGGGGTGGAACCCGCGCCCCGTGGGAAAcccgtgggagagtcgctccactcccactcgcggtgcacaaaaaacacaatatataaatcactgctcggtcgggtgagtcgtaaaagtctgacgtGCCCTCGCTGTGGGGGGGGGTGGAACCCGCGCCCCGTGGGAAAcccgtgggagagtgggtg');

addSequence('agtccccgtgagagcggctcgggtaaaagtctgacgtGCCCTCGCTGTGGGGGGGGGTGGAACCCGCGCCCCGTGGGAAAcccgtgggagccgcgctagtcgctccactcccactcgcggtgcacaaaaaacacaatatataaatcact');

addSequence('accgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
	        'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
	        'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg' +
		    'ccgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg');


addSequence('agtccccgtgagagcggctcgggtaaaagtctgacgtGCCCTCGCTGTGGGGGGGGGTGGAACCCGCGCCCCGTGGGAAAcccgtgggagccgcgctagtcgctccactcccactcgcggtgcacaaaaaacacaatatataaatcactccgtgggagagtcgctccactcccactcgcggtgcacaaaaaacacaatatataaatcactgctcggtcgggtgagtcgtaaaagtctgacgtGCCCTCGCTGTGGGGGGGGGTGGAACCCGCGCCCCGTGGGAAAcccgtgggagagtgggtg');

addSequence('actgacccgctcgggagcagagacacacgctcgagctgacgctcacgtctcgacgtcgctcgggaacactcgcaaaaacacgcgcgcgcgcgcgcgcgcgcgcgttgtgtgggtggcccacagtctcggg');
	
addSequence('accgtagcgatggctagggcgatttcgcgacaccgtagacgctcgaggctctcgacacagcttctcgggcgcgcgcgcattatatatatatataatcggccgtagagagagagagctcttctctcgagagagagagcgcgcgcggcctcttctcgcgcagagagcg');

console.log("To jest ta sekwencja: " + seqs["2"]["sequence"]);

console.log("To jest ta sekwencja: " + seqs["numSeq"]);
