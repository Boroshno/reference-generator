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
            name: new FormControl(''),
            surname: new FormControl(''),
            mainAuthor: new FormControl({ name: '', surname: ''}),
            chapter: new FormControl(''),
            book: new FormControl('', Validators.required),
            booktype: new FormControl(''),
            city: new FormControl('', Validators.required),
            publish: new FormControl('', Validators.required),
            year: new FormControl('', Validators.required),
            page: new FormControl('', Validators.required),
            ISBN: new FormControl(''),
            type: new FormControl('book'),
            addAuthor: new FormArray([new FormControl(123)]),
          });
      
        this.onChanges();
      }

      onChanges(): void {
        this.bookForm.valueChanges.subscribe(val => {
            this.formValid = this.bookForm.valid;
            if (this.bookForm.valid)
            {
                this.errorMessage = "";
                var chapter = val.chapter == '' ? '' : "— ${val.chapter} // ";
                var ISBN = val.ISBN == '' ? '' : "— ${val.ISBN}.";
                var bookType = val.bookType == '' ? '' : ": ${val.bookType} ";
                this.reference =
                `${val.surname}, ${val.name}  ${chapter}${val.book} [Текст] ${bookType}/ ${val.name} ${val.surname} — ${val.city} : ${val.publish}, ${val.year}. — ${val.page} с.${ISBN}`;
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
}

