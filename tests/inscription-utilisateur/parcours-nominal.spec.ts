// spec: specs/inscription-utilisateur.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Inscription d\'un nouvel utilisateur', () => {
  test('Parcours nominal : inscription complète, connexion effective et suppression du compte', async ({ page }) => {
    // Bloquer publicités et bandeau de consentement : ils peuvent masquer les éléments
    await page.route(
      /googlesyndication|doubleclick|googleadservices|adservice\.google|fundingchoicesmessages/,
      (route) => route.abort()
    );

    const email = `qa.${Date.now()}@example.com`;

    // 1. Préconditions : ouvrir l'accueil et vérifier le titre
    await page.goto('/');
    await expect(page).toHaveTitle('Automation Exercise');
    await expect(page.getByRole('link', { name: 'Signup / Login' })).toBeVisible();

    // 2. Cliquer sur le lien « Signup / Login »
    await page.getByRole('link', { name: 'Signup / Login' }).click();
    await expect(page).toHaveURL(/\/login/);
    await expect(page).toHaveTitle('Automation Exercise - Signup / Login');
    await expect(page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible();

    // 3. Saisir Name et l'email unique, puis cliquer sur « Signup »
    await page.locator('[data-qa="signup-name"]').fill('QA Test');
    await page.locator('[data-qa="signup-email"]').fill(email);
    await page.locator('[data-qa="signup-button"]').click();
    await expect(page).toHaveURL(/\/signup/);
    await expect(page).toHaveTitle('Automation Exercise - Signup');
    await expect(page.getByText('ENTER ACCOUNT INFORMATION')).toBeVisible();
    await expect(page.locator('[data-qa="name"]')).toHaveValue('QA Test');
    await expect(page.locator('[data-qa="email"]')).toHaveValue(email);
    await expect(page.locator('[data-qa="email"]')).toBeDisabled();

    // 4. Title, Password, Date of Birth et cases à cocher
    await page.getByLabel('Mr.').check();
    await page.locator('[data-qa="password"]').fill('Passw0rd!');
    await page.locator('[data-qa="days"]').selectOption('10');
    await page.locator('[data-qa="months"]').selectOption('5');
    await page.locator('[data-qa="years"]').selectOption('1990');
    await page.getByLabel('Sign up for our newsletter!').check();
    await page.getByLabel('Receive special offers from our partners!').check();
    await expect(page.getByLabel('Mr.')).toBeChecked();
    await expect(page.locator('[data-qa="password"]')).toHaveValue('Passw0rd!');
    await expect(page.locator('[data-qa="days"]')).toHaveValue('10');
    await expect(page.locator('[data-qa="months"]')).toHaveValue('5');
    await expect(page.locator('[data-qa="years"]')).toHaveValue('1990');
    await expect(page.getByLabel('Sign up for our newsletter!')).toBeChecked();
    await expect(page.getByLabel('Receive special offers from our partners!')).toBeChecked();

    // 5. ADDRESS INFORMATION
    await page.locator('[data-qa="first_name"]').fill('Jean');
    await page.locator('[data-qa="last_name"]').fill('Dupont');
    await page.locator('[data-qa="company"]').fill('ACME');
    await page.locator('[data-qa="address"]').fill('1 rue de Test');
    await page.locator('[data-qa="address2"]').fill('Bat B');
    await page.locator('[data-qa="country"]').selectOption('Canada');
    await page.locator('[data-qa="state"]').fill('Ontario');
    await page.locator('[data-qa="city"]').fill('Toronto');
    await page.locator('[data-qa="zipcode"]').fill('M5V 2T6');
    await page.locator('[data-qa="mobile_number"]').fill('0612345678');
    await expect(page.locator('[data-qa="first_name"]')).toHaveValue('Jean');
    await expect(page.locator('[data-qa="country"]')).toHaveValue('Canada');
    await expect(page.locator('[data-qa="mobile_number"]')).toHaveValue('0612345678');

    // 6. Cliquer sur « Create Account »
    await page.locator('[data-qa="create-account"]').click();
    await expect(page).toHaveURL(/\/account_created/);
    await expect(page).toHaveTitle('Automation Exercise - Account Created');
    await expect(page.locator('[data-qa="account-created"]')).toHaveText(/account created!/i);
    await expect(page.getByText('Congratulations! Your new account has been successfully created!')).toBeVisible();
    await expect(page.locator('[data-qa="continue-button"]')).toBeVisible();

    // 7. Cliquer sur « Continue » : connexion effective
    await page.locator('[data-qa="continue-button"]').click();
    await expect(page).toHaveURL('/');
    await expect(page.getByText('Logged in as QA Test')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Delete Account' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Signup / Login' })).toHaveCount(0);

    // 8. Nettoyage : supprimer le compte
    await page.getByRole('link', { name: 'Delete Account' }).click();
    await expect(page).toHaveURL(/\/delete_account/);
    await expect(page.locator('[data-qa="account-deleted"]')).toHaveText(/account deleted!/i);
    await page.locator('[data-qa="continue-button"]').click();
    await expect(page.getByRole('link', { name: 'Signup / Login' })).toBeVisible();
  });
});
