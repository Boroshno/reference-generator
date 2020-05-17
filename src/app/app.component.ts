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

    constructor(private formBuilder: FormBuilder) {}

      ngOnInit() {
        this.bookForm = this.formBuilder.group({
            mainAuthor: new FormGroup({
                name: new FormControl(''),
                surname: new FormControl('')
              }),
            addAuthor: new FormArray([]),
            chapter: new FormControl(''),
            book: new FormControl('', Validators.required),
            bookType: new FormControl(''),
            redaction: new FormControl(''),
            city: new FormControl('', Validators.required),
            publish: new FormControl('', Validators.required),
            year: new FormControl('', Validators.required),
            page: new FormControl('', Validators.required),
            ISBN: new FormControl(''),
            type: new FormControl('book')
          });
      
        this.onChanges();
      }

      onChanges(): void {
        this.bookForm.valueChanges.subscribe(val => {
            this.formValid = this.bookForm.valid;
            if (this.bookForm.valid)
            {
                this.errorMessage = "";
                var chapter = val.chapter == '' ? '' : `— ${val.chapter} // `;
                var ISBN = val.ISBN == '' ? '' : `— ${val.ISBN}.`;
                var bookType = val.bookType == '' ? '' : `: ${val.bookType}`;
                var mainAuthorAtStart = (val.mainAuthor.surname == '' && val.mainAuthor.name == '') || this.bookForm.get('addAuthor')["controls"].length > 2 ? '' : `${val.mainAuthor.surname}, ${val.mainAuthor.name} `;
                var mainAuthorAtEnd = val.mainAuthor.surname == '' && val.mainAuthor.name == '' ? '' : `/ ${val.mainAuthor.name} ${val.mainAuthor.surname}`;
                if (mainAuthorAtEnd != '' && this.bookForm.get('addAuthor')["controls"].length > 0)
                {
                    mainAuthorAtEnd += ', ';
                }
                for (let control of this.bookForm.get('addAuthor')["controls"]) {
                    
                    mainAuthorAtEnd += `, ${control.value.name} ${control.value.surname}`
                }
                var redaction = val.redaction == '' ? '' : (mainAuthorAtEnd == '' ? `/ ${val.redaction}. ` : `; ${val.redaction}`);
                
                this.reference =
                `${mainAuthorAtStart}${chapter}${val.book} [Текст] ${bookType} ${mainAuthorAtEnd}${redaction}. — ${val.city} : ${val.publish}, ${val.year}. — ${val.page} с.${ISBN}`;
            }
            else
            {
                this.errorMessage = "Please, fill all the required fields to get the reference!";
                this.reference = "";
            }
        });
      }

      changeType(e) {
        alert("type changed")
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

