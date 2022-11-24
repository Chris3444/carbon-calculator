import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ModuleType } from '../emissionmodule/emission-module';
import { FactorManager } from '../emissionmodule/factor-manager';
import { AdvancedEmissionModule, AdvancedSubModule, ELECTRICITY_MODULE_ID, MOBILITY_MODULE_ID } from '../emissionmodule/modules/advanced-module';
import { MenuService } from '../shared';
import { NavigationService } from '../shared/navigation.service';
import { CalculationService } from '../_services/calculation.service';
import { TranslationManagerService } from '../_services/translation-manager.service';

@Component({
  selector: 'app-type-input',
  templateUrl: './type-input.component.html',
  styleUrls: ['./type-input.component.scss']
})
export class TypeInputComponent implements OnInit {

  private _factorManager: FactorManager = new FactorManager();

  module!: AdvancedEmissionModule;
  type !: AdvancedSubModule;

  constructor(private route:ActivatedRoute,private navigation:NavigationService, private calculationService:CalculationService, private menuService: MenuService, private translateService:TranslateService, private translationManagerService:TranslationManagerService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params=>{
      this.translateService.get("types." + params?.typeID).subscribe(translation => {
        this.navigation.changeMessage(translation);
      });

      this.translateService.getTranslation(this.translationManagerService.lang).subscribe(translations => {
        this.menuService.changeMenu([
          {icon:"delete", menuPointName: this.translationManagerService.getTranslation(translations, "delete"), link:"/emission/" + params.id + "/" + module?.id, onClick: () => this.delete()}]);
      });

      const calculation = this.calculationService.getById(params.id);
      if(calculation == null) return;
      this._factorManager = calculation.factorManager;
      let module = calculation?.modules.find(module => module.id == params.sptitle) as AdvancedEmissionModule;
      if(module){
        if(module.id == MOBILITY_MODULE_ID) {
          this.module = module as AdvancedEmissionModule;
          let type = module.getType(params.typeID);
          if(type) this.type = type;
        }else if(module.id == ELECTRICITY_MODULE_ID){
          this.module = module as AdvancedEmissionModule;
          let type = module.getType(params.typeID);
          if(type) this.type = type;
        }
      }
    })
  }
  save(){
    this.module.changeTypeValue(this.type.id, this.type.number);
    this.calculationService.save();
  }
  delete(){
    this.module.removeType(this.type.id);
  }

  get factorManager(): FactorManager{
    return this._factorManager;
  }

}
