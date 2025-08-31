# Crée un nouveau projet Web API
dotnet new webapi -n ContactApi
cd ContactApi

# Ajoute les packages nécessaires
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Swashbuckle.AspNetCore


dotnet ef migrations add InitialCreate
dotnet ef database update
dotnet run




 app.UseSwaggerUI(options => // UseSwaggerUI is called only in Development.
 {
     options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
     options.RoutePrefix = string.Empty;
 });
 
 curl -X 'GET' \
  'http://localhost:4400/api/Contacts' \
  -H 'accept: text/plain'
  
  // src/app/app.config.ts
import { ApplicationConfig, provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(), // Fournit HttpClient pour toute l'application
  ],
};


Sauvegarde le fichier .gitignore et ajoute-le à ton dépôt Git :
git add .gitignore
git commit -m "Ajout du fichier .gitignore pour exclure bin, obj, etc."

Nettoyer les fichiers déjà versionnés (si nécessaire)
git rm -r --cached bin/
git rm -r --cached obj/
git commit -m "Suppression des dossiers bin et obj du dépôt"


