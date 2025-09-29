
import { Component, effect, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ContactService } from '../../../../services/contact.service';

@Component({
  selector: 'app-contact-address',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule],
  template: `
    <div *ngIf="contactService.selectedContact(); else noAddress">
      <form [formGroup]="addressForm">
        <fieldset>
          <legend>Adresse</legend>
          <div>
            <label>Rue:</label>
            <input formControlName="street" />
          </div>
          <div>
            <label>Ville:</label>
            <input formControlName="city" />
          </div>
          <div>
            <label>Code Postal:</label>
            <input formControlName="postalCode" />
          </div>
          <div>
            <label>Pays:</label>
            <input formControlName="country" />
          </div>
          <div class="button-group">
            <button mat-raised-button color="primary" (click)="saveAddress()" [disabled]="addressForm.invalid">
              Enregistrer
            </button>
          </div>
        </fieldset>
      </form>
    </div>
    <ng-template #noAddress>
      <p>Sélectionnez un contact pour gérer son adresse.</p>
    </ng-template>
  `,
  styles: [`
    fieldset { border: 1px solid #ccc; border-radius: 4px; padding: 0.5rem; margin: 1rem 0; }
    .button-group { margin-top: 1rem; }
  `]
})
export class ContactAddressComponent implements OnInit {
  addressForm: FormGroup;
  private fb = inject(FormBuilder);
    contactService = inject(ContactService);

  constructor() {
    this.addressForm = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
    });
    // Utilise `effect` avec un guard pour réagir aux changements du Signal
    effect(() => {
      const id = this.contactService.selectedContactIdSignal();
      console.log('Selected contact ID changed (address):', id);

      // Guard : Met à jour le formulaire uniquement si un contact est sélectionné (id non null)
      if (id !== null) {
        this.updateForm();
      } else {
        // Réinitialise le formulaire si aucun contact n'est sélectionné
        this.addressForm.reset();
      }
    });
  }
   updateForm(): void {
    const contact = this.contactService.selectedContact();
    if (contact && contact.address) {
         console.log("selectedContact addressForm", contact.address);
      this.addressForm.patchValue(contact.address);
    } else {
      this.addressForm.reset();
    }
  }


  ngOnInit(): void {
    // Restaure l'état du formulaire depuis le service
    const savedState = this.contactService.getAddressFormState();
    console.log("restaure addressForm", savedState);
    if (savedState) {
      this.addressForm.patchValue(savedState);
    }

    // Sauvegarde l'état à chaque changement
    this.addressForm.valueChanges.subscribe(state => {
    
        console.log("sauve addressForm", state);
      this.contactService.setAddressFormState(state);
    });
  }

  saveAddress(): void {
    if (this.addressForm.valid) {
      const contact = this.contactService.selectedContact();
      if (contact?.id) {
        this.contactService.updateAddress(contact.id, this.addressForm.value);
      }
    }
  }
}
/* Améliore l'affichage du RIB */
app-rib-input {
  display: block;
  width: 100%;

  input {
    font-family: monospace;
    letter-spacing: 1px;
  }
}

<nz-form-item>
  <nz-form-label>RIB</nz-form-label>
  <nz-form-control [nzErrorTip]="errorTpl">
    <app-rib-input
      formControlName="compteBancaire.rib"
      [readonly]="!commercialStore.editing()"
    ></app-rib-input>
    <ng-template #errorTpl let-control>
      <ng-container *ngIf="control.hasError('invalidRib')">
        Clé RIB invalide.
      </ng-container>
    </ng-template>
  </nz-form-control>
</nz-form-item>

<nz-card title="Compte Bancaire" [bordered]="true" style="margin-bottom: 16px;">
  <form nz-form [formGroup]="commercialStore.commercialForm">
    <nz-form-item>
      <nz-form-label>RIB</nz-form-label>
      <nz-form-control>
        <app-rib-input
          formControlName="compteBancaire.rib"
          [readonly]="!commercialStore.editing()"
        ></app-rib-input>
      </nz-form-control>
    </nz-form-item>
  </form>
</nz-card>
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rib-input',
  standalone: true,
  imports: [NzInputModule, ReactiveFormsModule, CommonModule],
  template: `
    <nz-input
      [formControl]="control"
      [placeholder]="'Ex: 1234 56789 01234 5678901'"
      [readonly]="readonly"
      (blur)="onBlur()"
      (input)="onInput($event)"
    />
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RibInputComponent),
      multi: true,
    },
  ],
})
export class RibInputComponent implements ControlValueAccessor {
  @Input() readonly = false;
  control = new FormControl<string>('');
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.control.setValue(this.formatRib(value));
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.readonly = isDisabled;
    isDisabled ? this.control.disable() : this.control.enable();
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\s+/g, ''); // Supprime tous les espaces

    // Limite à 23 caractères (4+5+5+5+4 espaces)
    if (value.length > 23) {
      value = value.substring(0, 23);
    }

    // Applique le masque : #### ##### ##### #####
    const formattedValue = this.formatRib(value);
    this.control.setValue(formattedValue, { emitEvent: false });
    this.onChange(formattedValue);
  }

  onBlur(): void {
    this.onTouched();
  }

  private formatRib(value: string): string {
    if (!value) return '';

    // Supprime les espaces existants
    const cleanValue = value.replace(/\s+/g, '');

    // Découpe en groupes : 4-5-5-5-4
    const parts = [
      cleanValue.substring(0, 4),
      cleanValue.substring(4, 9),
      cleanValue.substring(9, 14),
      cleanValue.substring(14, 19),
      cleanValue.substring(19, 23),
    ].filter(part => part.length > 0);

    return parts.join(' ');
  }

  // Extrait les parties du RIB (pour utilisation externe)
  parseRib(rib: string): { banque: string; guichet: string; numeroCompte: string; cleRib: string } | null {
    if (!rib) return null;

    const cleanRib = rib.replace(/\s+/g, '');
    if (cleanRib.length !== 23) return null;

    return {
      banque: cleanRib.substring(0, 4),
      guichet: cleanRib.substring(4, 9),
      numeroCompte: cleanRib.substring(9, 19),
      cleRib: cleanRib.substring(19, 23),
    };
  }
}

