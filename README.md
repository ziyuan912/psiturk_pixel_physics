# psiturk-template


## Files to modify

Instructions go in: `instruct*.html `
Task HTML goes in: `stage.html`
Task JS goes in: `task.js`

## Experiment data

Main experiment data goes in `static/experiments/<exp_name>`. For this repo, one directory of video containing `vid0_model0`, `vid0_model1`, `vid1_model0`, `vid1_model1` and so on. This structure is parsed in `task.js` 
Intro videos (used in instructions) go in `static/experiments`. This is used in `instruct*.html`
Gotcha videos are used to catch bad turk inputs, go in `static/experiments`. This is used in `task.js` and these videos are randomly sprinkled in the form.

## Retrieving data

Export sqlite db to csv using `sqlite3 -header -csv participants.db "select * from turkdemo;" > out.csv`. Parse the csv, verifying length of turk input (equal to form length) and quality (excluding failing gotchas).
