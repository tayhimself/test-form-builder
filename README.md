### README.md

A simple form wizard for ESS using
 - a form builder from json
 - a radio button styling using peer classes in tailwindcss
 - a wizard to navigate between the steps


For multi-step form wizard : https://webdesign.tutsplus.com/tutorials/how-to-build-a-multi-step-form-wizard-with-javascript--cms-93342

For radio buttton styling :

https://dev.to/thomasvanholder/click-label-to-choose-radio-button-tailwindcsss-peer-class-39nb
https://stackoverflow.com/questions/70122273/make-radio-button-look-like-it-has-tick-and-border-upon-active
https://codepen.io/phusum/pen/VQrQqy

For template strings :
https://wesbos.com/template-strings-html

To build tailwindcss :

    pnpx tailwindcss -i ./src/main.css -o ./dist/output.css --content ./index.html --watch

To optimize tailwindcss :

    pnpx tailwindcss -i ./src/main.css -o ./dist/output.css --minify

Run the project on local server at /src/ess
