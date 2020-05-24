import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
     
@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit { 
    bookForm : FormGroup;
    reference : string;
    errorMessage: string;
    referenceList: string[] = [];
    formValid: boolean;
    showAuthorNamesInput: boolean;

    constructor(private formBuilder: FormBuilder) {}

      ngOnInit() {
        this.bookForm = this.formBuilder.group({
            isOrgAuth: new FormControl(false),
            orgAuthor: new FormControl(''),
            mainAuthor: new FormGroup({
                name: new FormControl(''),
                surname: new FormControl('')
              }),
            addAuthor: new FormArray([]),
            chapter: new FormControl(''),
            book: new FormControl('', Validators.required),
            bookTypeText: new FormControl(''),
            bookType: new FormControl(''),
            redaction: new FormControl(''),
            journal: new FormControl(''),
            journalDetails: new FormControl(''),
            journalPlace: new FormControl(''),
            journalYear: new FormControl(''),
            city: new FormControl('', Validators.required),
            publish: new FormControl(''),
            year: new FormControl('', Validators.required),
            page: new FormControl('', Validators.required),
            ISBN: new FormControl(''),
            type: new FormControl('book'),
            other: new FormControl(false)
          });
      
        this.onChanges();
      }

      onChanges(): void {
        this.bookForm.valueChanges.subscribe(val => {
            this.showAuthorNamesInput = this.bookForm.get('isOrgAuth').value;
            this.formValid = this.bookForm.valid;

            if (this.bookForm.valid)
            {
                this.errorMessage = "";
                var chapter = val.chapter == '' ? '' : ` ${val.chapter} // `;
                var ISBN = val.ISBN == '' ? '' : `— ${val.ISBN}.`;
                var bookType = val.bookType == '' ? '' : `: ${val.bookType}`;
                var documentType = val.bookTypeText == '' ? '' : ` [${val.bookTypeText}]`;
                var publisher = ` : ${val.publish}`;

                //authors
                if (!val.isOrgAuth)
                {
                    var mainAuthorAtStart = (val.mainAuthor.surname == '' && val.mainAuthor.name == '') || this.bookForm.get('addAuthor')["controls"].length > 2 ? '' : `${val.mainAuthor.surname}, ${val.mainAuthor.name} `;
                    var AuthorsAtEnd = val.mainAuthor.surname == '' && val.mainAuthor.name == '' ? '' : `/ ${val.mainAuthor.name} ${val.mainAuthor.surname}`;
                    for (let control of this.bookForm.get('addAuthor')["controls"]) {
                        
                        AuthorsAtEnd += `, ${control.value.name} ${control.value.surname}`
                    }
                    var other = val.other ? " [та інші]" : "";
                }
                else
                {
                    mainAuthorAtStart = '';
                    AuthorsAtEnd = `/ ${val.orgAuthor}`;
                    other = '';
                }


                var redaction = val.redaction == '' ? '' : (AuthorsAtEnd == '' ? `/ ${val.redaction}. ` : `; ${val.redaction}`);
                var journal = val.journal == '' ? '' : ` // ${val.journal}`;
                var journalDetails = val.journalDetails == '' ? '' : ` : ${val.journalDetails}`;
                var journalPlace = val.journalPlace == '' ? '' : ` / ${val.journalPlace}`;
                var journalYear = val.journalPlace == '' ? '' : ` — ${val.journalPlace}.`;
                
                this.reference =
                `${mainAuthorAtStart}${chapter}${val.book}${documentType} ${bookType} ${AuthorsAtEnd}${other}${redaction}${journal}${journalDetails}${journalPlace}. — ${val.city}${publisher}, ${val.year}.${journalYear} — ${val.page} с.${ISBN}`;
            }
            else
            {
                this.errorMessage = "Please, fill all the required fields to get the reference!";
                this.reference = "";
            }
        });
      }

    addReference(): void {
        if (this.reference != '' && this.formValid)
        {
            this.referenceList.push(this.reference);
        }
    }

    deleteReference(index): void {
        if (typeof this.referenceList[index] !== 'undefined') {
            this.referenceList.splice(index, 1);
        }
    }
    
    addAdditionalAuthors(): void {
        let control = <FormArray>this.bookForm.controls.addAuthor;
        control.push(
            new FormGroup({
                name: new FormControl(''),
                surname: new FormControl('')
              })
        )
    }
    
    deleteAdditionalAuthors(index): void {
        let control = <FormArray>this.bookForm.controls.addAuthor;
        control.removeAt(index);
    }
}

