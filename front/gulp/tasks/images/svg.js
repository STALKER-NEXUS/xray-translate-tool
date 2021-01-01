module.exports = () => {
	$.gulp.task("build:svg", () => {
		const pattern = /<svg/;
		
		return $.gulp.src($.config.paths.svg.src)
			// .pipe($.gp.replace({ js2svg: { pretty: true } }))
			.pipe($.spritesComponents.svgmin({ js2svg: { pretty: true } }))
			.pipe($.spritesComponents.cheerio({
				run: $ => {
					$("[fill^=\"#\"]").removeAttr("fill");
					$("[stroke]").removeAttr("stroke");
					$("[style]").removeAttr("style");
					$("[class]").removeAttr("class");
					$("[id]").removeAttr("id");
				},
				parserOptions: { xmlMode: true }
			}))
			.pipe($.spritesComponents.replace("&gt;", ">"))
			.pipe($.spritesComponents.svgSprite({
				mode: {
					symbol: {
						sprite: $.config.paths.svg.sprite,
						render: {
							scss: {
								dest: $.config.paths.svg.dest,
								template: $.config.paths.svg.template
							}
						}
					}
				}
			}))
			.pipe($.spritesComponents.replace(pattern, (match, p1, string) => {
				let repl = "<svg style=\"display: none;\"";
				let pug = $.html2pug(string.replace(pattern, repl), { tabs: true });
				let options = {
					fill_tab: true,
					omit_div: false,
					tab_size: 2
				};

				pug = pug.split("\n").slice(4).join("\n").replace(/^\s+/, "");
				pug = $.beautify(pug, options);

				$.fs.writeFile(
					$.config.paths.svg.pug, 
					pug, 
					err => err ? console.error(err) : 0
				);

				return repl;
			}))
			.pipe($.gulp.dest($.config.paths.svg.dist));
	});
}
