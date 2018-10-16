const chalk = require('chalk');
const packagejs = require('../../package.json');
const semver = require('semver');
const BaseGenerator = require('generator-jhipster/generators/generator-base');
const jhipsterConstants = require('generator-jhipster/generators/generator-constants');
const path = require('path');
const jhipsterUtils = require('generator-jhipster/generators/utils');
const shelljs = require('shelljs');

module.exports = class extends BaseGenerator {
    get initializing() {
        return {
            init(args) {
                if (args === 'default') {
                    // do something when argument is 'default'
                }
            },
            readConfig() {
                this.jhipsterAppConfig = this.getJhipsterAppConfig();
                if (!this.jhipsterAppConfig) {
                    this.error('Can\'t read .yo-rc.json');
                }
            },
            displayLogo() {
                // it's here to show that you can use functions from generator-jhipster
                // this function is in: generator-jhipster/generators/generator-base.js
                this.printJHipsterLogo();

                // Have Yeoman greet the user.
                this.log(`\nWelcome to the ${chalk.bold.yellow('JHipster leafletmap')} generator! ${chalk.yellow(`v${packagejs.version}\n`)}`);
            },
            checkJhipster() {
                const currentJhipsterVersion = this.jhipsterAppConfig.jhipsterVersion;
                const minimumJhipsterVersion = packagejs.dependencies['generator-jhipster'];
                if (!semver.satisfies(currentJhipsterVersion, minimumJhipsterVersion)) {
                    this.warning(`\nYour generated project used an old JHipster version (${currentJhipsterVersion})... you need at least (${minimumJhipsterVersion})\n`);
                }
            }
        };
    }

    prompting() {
        const prompts = [{
            type: 'input',
            name: 'message',
            message: 'Press ENTER to generate the leaflet map !',
            //default: 'hello world!'
        }];

        const done = this.async();
        this.prompt(prompts).then((props) => {
            this.props = props;
            // To access props later use this.props.someOption;

            done();
        });
    }

    writing() {
        // function to use directly template
        this.template = function(source, destination) {
            this.fs.copyTpl(
                this.templatePath(source),
                this.destinationPath(destination),
                this
            );
        };

        // read config from .yo-rc.json
        this.baseName = this.jhipsterAppConfig.baseName;
        this.packageName = this.jhipsterAppConfig.packageName;
        this.packageFolder = this.jhipsterAppConfig.packageFolder;
        this.clientFramework = this.jhipsterAppConfig.clientFramework;
        this.clientPackageManager = this.jhipsterAppConfig.clientPackageManager;
        this.buildTool = this.jhipsterAppConfig.buildTool;

        // use function in generator-base.js from generator-jhipster
        this.angularAppName = this.getAngularAppName();

        // use constants from generator-constants.js
        const javaDir = `${jhipsterConstants.SERVER_MAIN_SRC_DIR + this.packageFolder}/`;
        const resourceDir = jhipsterConstants.SERVER_MAIN_RES_DIR;
        const webappDir = jhipsterConstants.CLIENT_MAIN_SRC_DIR;

        // variable from questions
        this.message = this.props.message;

        // show all variables
        this.log('\n--- some config read from config ---');
        this.log(`baseName=${this.baseName}`);
        this.log(`packageName=${this.packageName}`);
        this.log(`clientFramework=${this.clientFramework}`);
        this.log(`clientPackageManager=${this.clientPackageManager}`);
        this.log(`buildTool=${this.buildTool}`);

        this.log('\n--- some function ---');
        this.log(`angularAppName=${this.angularAppName}`);

        this.log('\n--- some const ---');
        this.log(`javaDir=${javaDir}`);
        this.log(`resourceDir=${resourceDir}`);
        this.log(`webappDir=${webappDir}`);

        this.log('\n--- variables from questions ---');
        this.log(`\nmessage=${this.message}`);
        this.log('------\n');

        if (this.clientFramework === 'angular1') {
            this.template('dummy.txt', 'dummy-angular1.txt');
        }
        if (this.clientFramework === 'angularX' || this.clientFramework === 'angular2') {
            this.template('dummy.txt', 'dummy-angularX.txt');
            let appModulePath;

            appModulePath = `${webappDir}app/app.module.ts`;
            let pagesetsPath = `${webappDir}app/pages/page-sets.module.ts`;
            const fullPath2 = path.join(process.cwd(), pagesetsPath);
            const fullPath3 = path.join(__dirname, 'templates/pages/page-sets.module.ts');
            var appnamenomaj = this.angularAppName;
            var appname = appnamenomaj.charAt(0).toUpperCase() + appnamenomaj.substring(1, appnamenomaj.length - 3);
            this.log("APPNAME : ", appname);

            try {

                var str_ = this.fs.read(fullPath2);

                jhipsterUtils.rewriteFile({
                    file: pagesetsPath,
                    needle: 'jhipster-needle-add-pageset-module-import',
                    splicable: [`import { ${appname}LeafletModule } from './leaflet/leaflet.module';`]
                }, this);

                jhipsterUtils.rewriteFile({
                    file: pagesetsPath,
                    needle: 'jhipster-needle-add-pageset-module',
                    splicable: [`${appname}LeafletModule,`]
                }, this);

            } catch (e) { //ON ARRIVE ICI S'IL N EXISTE PAS DE page-sets module
                this.log(`Creation of the page-sets module`);
                //this.template('pages/page-sets.module.ts', `${webappDir}app/pages/page-sets.module.ts`);
                var str_ = this.fs.read(fullPath3);
                var res = str_.replace(`Cartegen`, `${appname}`);
                var res2 = res.replace(`Cartegen`, `${appname}`);
                var res3 = res2.replace(`Cartegen`, `${appname}`);
                this.fs.write(fullPath2, res3);


                jhipsterUtils.rewriteFile({
                    file: appModulePath,
                    needle: 'jhipster-needle-angular-add-module-import',
                    splicable: [`import { ${appname}PageSetsModule } from './pages/page-sets.module';`]
                }, this);

                jhipsterUtils.rewriteFile({
                    file: appModulePath,
                    needle: 'jhipster-needle-angular-add-module',
                    splicable: [`${appname}PageSetsModule,`]
                }, this);

            }

            const fullPath4 = path.join(__dirname, 'templates/pages/leaflet/leaflet.module.ts');
            const fullPath5 = path.join(process.cwd(), `${webappDir}app/pages/leaflet/leaflet.module.ts`);
            var str = this.fs.read(fullPath4);
            var res = str.replace(`import { CartegenSharedModule } from '../../shared';`, `import { ${appname}SharedModule } from '../../shared';`);
            var res2 = res.replace(`CartegenSharedModule,`, `${appname}SharedModule,`);
            var res3 = res2.replace('export class CartegenLeafletModule {}', `export class ${appname}LeafletModule {}`);
            this.fs.write(fullPath5, res3);

            var navbarPath = `${webappDir}app/layouts/navbar/navbar.component.html`;
            jhipsterUtils.rewriteFile({
                file: navbarPath,
                needle: 'jhipster-needle-add-element-to-menu',
                splicable: [`<li *ngSwitchCase="true" ngbDropdown class="nav-item dropdown pointer">
                        <a class="nav-link dropdown-toggle" routerLinkActive="active" ngbDropdownToggle href="javascript:void(0);" id="leaflet-menu">
                            <span>
                                <i class="fa fa-" aria-hidden="true"></i>
                                <span>leaflet</span>
                            </span>
                        </a>
                        <ul class="dropdown-menu" ngbDropdownMenu>
                            <li>
                                <a class="dropdown-item" routerLink="leaflet-map" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="collapseNavbar()">
                                    <i class="fa fa-" aria-hidden="true"></i>&nbsp;
                                    <span>Leaflet Map</span>
                                </a>
                            </li>
                            <!-- jhipster-needle-add-element-to-leaflet - JHipster will add elements to the leaflet here -->
                        </ul>
                    </li>`]
            }, this);

      //       var angularclipath = `.angular-cli.json`
      //       jhipsterUtils.rewriteFile({
      //           file: angularclipath,
      //           needle: '"favicon.ico"',
      //           splicable: [`{
      //     "glob": "**/*",
      //     "input": "../../../node_modules/leaflet/dist/images",
      //     "output": "leaflet/"
      //   },`]
      // }, this);



            try { //If the extension of the vendor is scss

                /*({
                    file: angularclipath,
                    needle: '"content/scss/vendor.scss",',
                    splicable: [`        "../../../node_modules/leaflet/dist/leaflet.css"`]
                }, this);*/

                var vendorscsspath = `${webappDir}content/scss/vendor.scss`;
                jhipsterUtils.rewriteFile({
                    file: vendorscsspath,
                    needle: 'jhipster-needle-scss-add-vendor',
                    splicable: [`@import '../../../../../node_modules/leaflet/dist/leaflet.css';`]
                }, this);
                this.log(`vendor.scss updated`);

            } catch (e) { //Else if the extension of the vendor is css


              /*  jhipsterUtils.rewriteFile({
                    file: angularclipath,
                    needle: '"content/css/vendor.css",',
                    splicable: [`        "../../../node_modules/leaflet/dist/leaflet.css"`]
                }, this);*/

                var vendorscsspath = `${webappDir}content/css/vendor.css`;
                jhipsterUtils.rewriteFile({
                    file: vendorscsspath,
                    needle: `/* after changing this file run 'yarn run webpack:build' */`,
                    splicable: [`@import '../../../../../node_modules/leaflet/dist/leaflet.css';`]
                }, this);
                this.log(`vendor.css updated`);

            }





            this.template('leaflet.json', '.jhipster/pages/leaflet.json');
            //this.template('app.module.ts', `${webappDir}app/app.module.ts`);
            //this.template('pages/page-sets.module.ts', `${webappDir}app/pages/page-sets.module.ts`);
            //this.template('pages/leaflet/leaflet.module.ts', `${webappDir}app/pages/leaflet/leaflet.module.ts`);
            this.template('pages/leaflet/leaflet.route.ts', `${webappDir}app/pages/leaflet/leaflet.route.ts`);
            this.template('pages/leaflet/index.ts', `${webappDir}app/pages/leaflet/index.ts`);
            this.template('pages/leaflet/map.service.ts', `${webappDir}app/pages/leaflet/map.service.ts`);
            this.template('pages/leaflet/map.component.ts', `${webappDir}app/pages/leaflet/map.component.ts`);
            this.template('pages/leaflet/map.component.html', `${webappDir}app/pages/leaflet/map.component.html`);
            this.template('pages/leaflet/map.model.ts', `${webappDir}app/pages/leaflet/map.model.ts`);
            this.template('map.component.spec.ts', `src/test/javascript/spec/app/pages/leaflet/map.component.spec.ts`);
            this.template('map.spec.ts', `src/test/javascript/e2e/pages/map.spec.ts`);
            //this.template('navbar.component.html', `${webappDir}app/layouts/navbar/navbar.component.html`);
            this.template('dummy.txt', 'dummy-angularXvalidd.txt');
        }
        if (this.buildTool === 'maven') {
            this.template('dummy.txt', 'dummy-maven.txt');
        }
        if (this.buildTool === 'gradle') {
            this.template('dummy.txt', 'dummy-gradle.txt');
        }
    }

    install() {
        let logMsg =
            `To install your dependencies manually, run: ${chalk.yellow.bold(`${this.clientPackageManager} install`)}`;

        if (this.clientFramework === 'angular1') {
            logMsg =
                `To install your dependencies manually, run: ${chalk.yellow.bold(`${this.clientPackageManager} install & bower install`)}`;
        }
        const injectDependenciesAndConstants = (err) => {
            if (err) {
                this.warning('Install of dependencies failed!');
                this.log(logMsg);
            } else if (this.clientFramework === 'angular1') {
                this.spawnCommand('gulp', ['install']);
            }
        };
        const installConfig = {
            bower: this.clientFramework === 'angularX',
            npm: this.clientPackageManager !== 'yarn',
            yarn: this.clientPackageManager === 'yarn',
            callback: injectDependenciesAndConstants
        };
        if (this.options['skip-install']) {
            this.log(logMsg);
        } else {
            //this.installDependencies(installConfig);
            shelljs.exec(`cd ${process.cwd()} && yarn add leaflet@1.3.1`);
            shelljs.exec(`cd ${process.cwd()} && yarn add @types/leaflet@1.2.6`);
            shelljs.exec(`cd ${process.cwd()} && yarn add @asymmetrik/ngx-leaflet@3.0.2`);
            this.rebuildClient();
        }
    }

    end() {
        this.log('End of leafletmap generator');
    }
};
