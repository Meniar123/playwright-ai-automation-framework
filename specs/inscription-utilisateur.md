# Plan de test - Inscription d'un nouvel utilisateur

## Application Overview

Plan de test de la fonctionnalité « Inscription d'un nouvel utilisateur » de https://automationexercise.com. Parcours : lien « Signup / Login » (/login) -> formulaire « New User Signup! » (Name, Email Address, bouton « Signup ») -> /signup « ENTER ACCOUNT INFORMATION » + « ADDRESS INFORMATION » (bouton « Create Account ») -> /account_created « ACCOUNT CREATED! » -> « Continue » -> accueil connecté (« Logged in as <nom> »). Nettoyage : « Delete Account » -> « ACCOUNT DELETED! » -> « Continue ». Constats d'exploration : sélecteurs data-qa signup-name, signup-email, signup-button, password, days, months, years, first_name, last_name, company, address, address2, country, state, city, zipcode, mobile_number, create-account, account-created, continue-button, account-deleted. Étape 1 : Name et Email Address (type=email) sont required, validation HTML5 native (pas de soumission, on reste sur /login ; le texte de la bulle dépend de la langue du navigateur). Étape 2 : champs obligatoires = Password, First name, Last name, Address, Country (présélectionné India), State, City, Zipcode, Mobile Number ; facultatifs = Title, Date of Birth, 2 cases à cocher, Company, Address 2. Name et Email sont préremplis à l'étape 2, Email est désactivé (disabled). Pays : India, United States, Canada, Australia, Israel, New Zealand, Singapore. Message de doublon réel : « Email Address already exist! » (rouge, sous New User Signup!, URL /signup). Succès : « ACCOUNT CREATED! », « Congratulations! Your new account has been successfully created! », « You can now take advantage of member privileges to enhance your online shopping experience with us. ». Hypothèses communes : état initial vierge (non connecté, cookies vides), publicités bloquées comme dans tests/seed.spec.ts, email unique de type qa.<horodatage>@example.com (ex. Date.now()), comptes créés supprimés en nettoyage.

## Test Scenarios

### 1. Inscription d'un nouvel utilisateur

**Seed:** `tests/seed.spec.ts`

#### 1.1. Parcours nominal : inscription complète, connexion effective et suppression du compte

**File:** `tests/inscription-utilisateur/parcours-nominal.spec.ts`

**Steps:**
  1. Préconditions : utilisateur non connecté, aucun compte existant avec l'email du test. Générer email = qa.<Date.now()>@example.com. Ouvrir https://automationexercise.com/ et vérifier le titre « Automation Exercise ».
    - expect: La page d'accueil s'affiche et le menu contient « Signup / Login ».
  2. Cliquer sur le lien « Signup / Login ».
    - expect: URL /login, titre « Automation Exercise - Signup / Login ».
    - expect: Les titres « Login to your account » et « New User Signup! » sont visibles.
  3. Dans « New User Signup! », saisir Name = « QA Test » et l'email unique, puis cliquer sur « Signup ».
    - expect: Navigation vers /signup, titre « Automation Exercise - Signup ».
    - expect: Titre « ENTER ACCOUNT INFORMATION » visible.
    - expect: Name = « QA Test » et Email = email saisi sont préremplis, le champ Email est désactivé.
  4. Choisir Title « Mr. », saisir Password « Passw0rd! », Date of Birth 10 / May / 1990, cocher « Sign up for our newsletter! » et « Receive special offers from our partners! ».
    - expect: Les valeurs sont acceptées et affichées.
  5. Sous « ADDRESS INFORMATION », saisir First name « Jean », Last name « Dupont », Company « ACME », Address « 1 rue de Test », Address 2 « Bat B », Country « Canada », State « Ontario », City « Toronto », Zipcode « M5V 2T6 », Mobile Number « 0612345678 ».
    - expect: Tous les champs acceptent les valeurs, aucun message d'erreur.
  6. Cliquer sur « Create Account ».
    - expect: URL /account_created, titre « Automation Exercise - Account Created ».
    - expect: Titre « ACCOUNT CREATED! » visible.
    - expect: Texte « Congratulations! Your new account has been successfully created! » visible.
    - expect: Bouton « Continue » visible.
  7. Cliquer sur « Continue ».
    - expect: Retour sur la page d'accueil (/).
    - expect: Le menu affiche « Logout » et « Delete Account » et n'affiche plus « Signup / Login ».
    - expect: « Logged in as QA Test » est visible (connexion effective).
  8. Nettoyage : cliquer sur « Delete Account », vérifier « ACCOUNT DELETED! », cliquer sur « Continue ».
    - expect: URL /delete_account avec « ACCOUNT DELETED! ».
    - expect: Retour à l'accueil, menu de nouveau avec « Signup / Login » (déconnecté).

#### 1.2. Parcours nominal minimal : seuls les champs obligatoires renseignés

**File:** `tests/inscription-utilisateur/parcours-minimal.spec.ts`

**Steps:**
  1. Préconditions : état vierge. Aller sur /login, saisir Name « QA Min » et un email unique (horodatage), cliquer sur « Signup ».
    - expect: Le formulaire « ENTER ACCOUNT INFORMATION » s'affiche.
  2. Ne pas toucher à Title, Date of Birth, cases à cocher, Company, Address 2. Renseigner uniquement Password, First name, Last name, Address, State, City, Zipcode, Mobile Number (Country reste India).
    - expect: Aucune erreur de validation.
  3. Cliquer sur « Create Account », puis « Continue ».
    - expect: « ACCOUNT CREATED! » s'affiche, puis « Logged in as QA Min » sur l'accueil (les champs facultatifs ne sont pas requis).
  4. Nettoyage : « Delete Account » puis « Continue ».
    - expect: « ACCOUNT DELETED! » affiché.

#### 1.3. Email déjà utilisé : message « Email Address already exist! »

**File:** `tests/inscription-utilisateur/email-deja-utilise.spec.ts`

**Steps:**
  1. Préconditions : créer via le parcours nominal un compte avec email unique E (mot de passe « Passw0rd! »), cliquer « Continue » puis « Logout ». L'utilisateur est déconnecté.
    - expect: URL /login après Logout, formulaire New User Signup! vide.
  2. Dans « New User Signup! », saisir Name « Autre Nom » et exactement le même email E, cliquer sur « Signup ».
    - expect: L'URL devient /signup mais on reste sur la page Login / New User Signup!.
    - expect: Le message exact « Email Address already exist! » s'affiche en rouge sous le formulaire New User Signup!.
    - expect: Le formulaire « ENTER ACCOUNT INFORMATION » n'est PAS affiché.
    - expect: Le champ Name conserve « Autre Nom ».
  3. Vérifier que la page n'a pas connecté l'utilisateur.
    - expect: Le menu affiche toujours « Signup / Login », pas de « Logged in as ».
  4. Nettoyage : se connecter via « Login to your account » avec E / « Passw0rd! », cliquer sur « Delete Account » puis « Continue ».
    - expect: « ACCOUNT DELETED! » affiché.

#### 1.4. Email déjà utilisé : variante en majuscules (anomalie connue, test.fail())

**File:** `tests/inscription-utilisateur/email-deja-utilise-casse.spec.ts`

**Note :** ce test doit être marqué `test.fail()`. Le comportement actuel est une anomalie connue : l'unicité de l'email est sensible à la casse, voir « Anomalies et constats ». Le test échoue tant que l'anomalie n'est pas corrigée.

**Steps:**
  1. Préconditions : compte existant avec l'email E en minuscules (créé puis déconnecté). Saisir Name « Case » et E en MAJUSCULES, cliquer sur « Signup ».
    - expect: Le message exact « Email Address already exist! » s'affiche en rouge sous le formulaire New User Signup!.
    - expect: Le formulaire « ENTER ACCOUNT INFORMATION » n'est PAS affiché.
  2. Nettoyage : se connecter avec E, supprimer le compte.
    - expect: « ACCOUNT DELETED! » affiché.

#### 1.5. Étape 1 : champs obligatoires vides (Name, Email Address)

**File:** `tests/inscription-utilisateur/etape1-champs-obligatoires.spec.ts`

**Steps:**
  1. Préconditions : état vierge, page /login. Cliquer sur « Signup » sans rien saisir.
    - expect: Validation HTML5 native : bulle sur le champ Name (en français : « Veuillez renseigner ce champ. »).
    - expect: Aucune soumission : l'URL reste /login, pas de requête POST, aucun message serveur.
  2. Saisir uniquement un email valide (ex. a@example.com), Name vide, cliquer sur « Signup ».
    - expect: Bulle de validation sur Name (checkValidity false), reste sur /login.
  3. Saisir uniquement Name « Test », Email vide, cliquer sur « Signup ».
    - expect: Bulle de validation sur Email Address, reste sur /login.
  4. Vérifier que les champs Name (data-qa=signup-name) et Email Address (signup-email) ont l'attribut required.
    - expect: Les deux champs sont required.

#### 1.6. Étape 2 : formulaire entièrement vide

**File:** `tests/inscription-utilisateur/etape2-formulaire-vide.spec.ts`

**Steps:**
  1. Préconditions : atteindre /signup avec Name « QA Vide » et un email unique.
    - expect: Formulaire ENTER ACCOUNT INFORMATION affiché.
  2. Sans rien remplir, cliquer sur « Create Account ».
    - expect: Validation HTML5 native : pas de soumission, URL reste /signup.
    - expect: Le focus est placé sur le premier champ invalide, Password, avec la bulle « Veuillez renseigner ce champ. » (selon la langue du navigateur).
    - expect: Les champs invalides sont : Password, First name, Last name, Address, State, City, Zipcode, Mobile Number ; Country est déjà valide (India).
  3. Vérifier l'absence de redirection vers /account_created.
    - expect: Aucun compte créé, pas de « Logged in as ».

#### 1.7. Étape 2 : un seul champ obligatoire manquant à la fois

**File:** `tests/inscription-utilisateur/etape2-champ-manquant.spec.ts`

**Steps:**
  1. Préconditions : atteindre /signup avec un email unique. Pour chacun des champs Password, First name, Last name, Address, State, City, Zipcode, Mobile Number : remplir tous les champs obligatoires sauf celui-ci (le laisser vide), puis cliquer sur « Create Account » (scénario paramétré, un cas par champ ; recharger le formulaire entre deux cas si nécessaire).
    - expect: Pour chaque cas : bulle de validation HTML5 sur le champ vide uniquement, focus dessus, pas de soumission, URL reste /signup, aucune création de compte.
  2. Vérifier que Title, Date of Birth, Company, Address 2 et les deux cases à cocher ne sont pas requis, et que Country est présélectionné (India) donc ne peut pas être vide.
    - expect: Aucune validation bloquante sur ces champs (la création avec les seuls champs obligatoires est couverte par le scénario 1.2).

#### 1.8. Format d'email invalide à l'étape 1 (validation navigateur)

**File:** `tests/inscription-utilisateur/email-invalide.spec.ts`

**Steps:**
  1. Préconditions : page /login, Name « Test » saisi. Pour chaque email suivant, le saisir dans Email Address puis cliquer sur « Signup » : « usernoat.com » (sans @), « user@ » (sans domaine), « @domain.com » (sans partie locale), « user@@domain.com » (double @), « user name@domain.com » (espace), « user@domain..com » (points consécutifs), « user@.com » (point après @).
    - expect: Pour chaque cas : validation HTML5 type=email, pas de soumission, URL reste /login, bulle d'erreur (ex. en français : « Veuillez inclure "@" dans l'adresse e-mail... », « Veuillez saisir la partie manquante après le symbole "@"... », « Veuillez saisir la partie manquante avant le caractère "@"... »).
    - expect: Aucun message « Email Address already exist! » ni passage à l'étape 2.
    - expect: Les assertions doivent privilégier checkValidity() / validity.typeMismatch plutôt que le texte exact de la bulle (dépend de la langue).
  2. Cas « a@b.c » ou « user@domain » (non uniques).
    - expect: Comportement observé : validation HTML5 réussie ; le serveur a répondu « Email Address already exist! » (ces adresses existent déjà, d'où l'importance d'utiliser des emails uniques).

## Anomalies et constats

Comportements observés pendant l'exploration, qui ne sont pas vérifiés comme attendus dans les scénarios ci-dessus.

| # | Constat | Reproduction | Comportement observé | Comportement attendu | Couverture |
|---|---------|--------------|----------------------|----------------------|------------|
| A1 | Unicité de l'email sensible à la casse (anomalie connue) | Créer un compte avec E en minuscules, puis s'inscrire avec E en MAJUSCULES | Aucune erreur de doublon, passage à « ENTER ACCOUNT INFORMATION » | Message « Email Address already exist! » | Scénario 1.4, marqué `test.fail()` |
| A2 | Name composé uniquement d'espaces accepté | Étape 1 : Name = espaces, email unique valide, « Signup » | Passage à « ENTER ACCOUNT INFORMATION », aucune validation du contenu côté serveur | Rejet d'un nom vide après suppression des espaces | Non couvert par un test |
| A3 | Email sans TLD accepté | Étape 1 : email « fresh<horodatage>@domain », « Signup » | Accepté par la validation HTML5 et par le serveur, passage à « ENTER ACCOUNT INFORMATION » | Rejet d'un domaine sans extension (à confirmer avec le métier) | Non couvert par un test |
