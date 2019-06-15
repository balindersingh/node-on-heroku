const fs = require("fs");
const path = require("path");
const puppeteer = require('puppeteer');
const handlebars = require("handlebars");
var createPDF = async function(contentInfoObj){
	var milis = new Date();
	var pdfName = 'file-'+milis.getTime()+'.pdf';
	var html = "";
	if(contentInfoObj.isContent){
		var templateHtml = (contentInfoObj.templateContent===undefined || contentInfoObj.templateContent==="")? fs.readFileSync(path.resolve(__dirname, './static/templates/profile.html'), 'utf8'):contentInfoObj.templateContent;
		var template = handlebars.compile(templateHtml);
		html = template(contentInfoObj.mergeFieldsContent);
	}
	
	var pdfPath = path.join(path.resolve(__dirname, './static/pdfs/'), pdfName);

	var options = {
		width: '1230px',
		headerTemplate: "<p>HEADER</p>",
		footerTemplate: "<p>FOOTER</p>",
		displayHeaderFooter: true,
		margin: {
			top: "10px",
			bottom: "30px"
		},
		printBackground: false,
		path: pdfPath
	}

	const browser = await puppeteer.launch({
		args: ['--no-sandbox'],
		headless: true
	});

	var page = await browser.newPage();
	var contentHTML ;
	if(contentInfoObj.isContent){
		contentHTML = `data:text/html;charset=UTF-8,${html}`;
	}else{
		contentHTML = contentInfoObj.externalLink;
	} 
	await page.goto(contentHTML, {
		waitUntil: 'networkidle0'
	});

	await page.pdf(options);
	await browser.close();
	return '/static/pdfs/'+pdfName;
}
module.exports = {
    createPDFFromHTML: function (contentInfoObj) {
        return createPDF(contentInfoObj);
	},
	getContentInfo: function (externalLink,templateContent,mergeFieldsContent) {
		return new ContentInfo(externalLink,templateContent,mergeFieldsContent);
	},
	getContentInfo2: function () {
		return new ContentInfo();
	}
}
class ContentInfo {
	/**
	 * 
	 * @param {string} externalLink link to public external page which needs to be render as PDF in case isContent is 
	 * @param {string} templateContent html content of the template if external link is not provided.
	 * @param {KeyValuePair} mergeFieldsContent merge fields in form of kay value pair to be merged to template using handle bars {{ }} . if it is null template will be rednered as is
	 */
	constructor(externalLink,templateContent,mergeFieldsContent) {
		if (!arguments.length) {
			this.isContent = false;
			this.externalLink = "";
			this.templateContent = "";
			this.mergeFieldsContent = "";
		}else{
			this.isContent = false;
			if(externalLink==undefined || externalLink===""){
				this.isContent = true;
			}
			this.externalLink = externalLink;
			this.templateContent = templateContent;
			this.mergeFieldsContent = mergeFieldsContent;
		}
	}
}