<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Procurement Panel</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="/css/app.css" rel="stylesheet">
        <link href="/css/custom.css" rel="stylesheet">
        <link href="/css/ngDialog.css" rel="stylesheet">
        <link href="/css/ngDialog-theme-default.css" rel="stylesheet">
        <link rel="stylesheet" href="/css/sweet-alert.css">
        <link rel="stylesheet" href="/css/angular-datepicker.css">
        <link rel="stylesheet" href="/css/ng-tags-input.min.css">
        <link rel="stylesheet" href="/css/angucomplete.css">
        <!-- <link href="css/ngDialog-theme-plain.css" rel="stylesheet"> -->

        <link rel="stylesheet" href="https://unpkg.com/angular-toastr/dist/angular-toastr.css" />
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous">

        <base href="/">
    </head>
    <body ng-app="authApp" ng-cloak>

        <div class="overlay"></div>
        <div class="loader">
            <img src="/images/loader.gif" />
        </div>

        <div id="app">
            
            <nav class="navbar navbar-default navbar-static-top" ng-controller="HeaderController">
                <div class="container">
                    <div class="navbar-header">

                        <!-- Collapsed Hamburger -->
                        <button type="button" ng-if="authenticated" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#app-navbar-collapse">
                            <span class="sr-only">Toggle Navigation</span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>

                        <!-- Branding Image -->
                        <a class="navbar-brand" href="/dashboard">
                            Procurement
                        </a>
                    </div>

                    <div class="collapse navbar-collapse" id="app-navbar-collapse">
                        <!-- Left Side Of Navbar -->
                        <!-- <ul class="nav navbar-nav">
                            &nbsp;
                        </ul> -->

                        <!-- Right Side Of Navbar -->
                        <ul class="nav navbar-nav navbar-right">
                            <!-- Authentication Links -->
                                <!-- <li ng-if="!authenticated"><a href="#">Login</a></li>
                                <li ng-if="!authenticated"><a href="#">Register</a></li> -->
                                <li ng-if="authenticated">
                                    <a href="javascript:void(0);">
                                        {% currentUser.name %}</span>
                                    </a>

                                    <!-- <ul class="dropdown-menu" ng-show="show_menu" role="menu">
                                        <li>
                                            <a ng-click="logout()">
                                                Logout
                                            </a>
                                        </li>
                                    </ul> -->
                                </li>
                                <li ng-if="authenticated" class="dropdown">
                                    <a href="javascript:void(0);" ng-click="logout()">
                                        Logout
                                    </a>
                                </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div class="container">
                <div ui-view></div>
            </div>        
        </div>

    </body>

    <!-- Application Dependencies -->
    <script src="js/app.js"></script>
    <script src="node_modules/angular/angular.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.9/angular-animate.js"></script>
    <script src="node_modules/angular-ui-router/release/angular-ui-router.js"></script>
    <script src="node_modules/satellizer/dist/satellizer.js"></script>
    <script src="https://unpkg.com/angular-toastr/dist/angular-toastr.tpls.js"></script>
    <script src="js/ngDialog.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.0/angular-messages.js"></script>
    <script type="text/javascript" src="js/sweet-alert.min.js"></script>
    <script type="text/javascript" src="js/SweetAlert.js"></script>
    <script type="text/javascript" src="js/angular-datepicker.js"></script>
    <script type="text/javascript" src="js/ng-tags-input.min.js"></script>
    <script type="text/javascript" src="js/angucomplete.js"></script>

    <!-- Application Scripts -->
    <script src="scripts/app.js"></script>
    <script src="scripts/controllers/authController.js"></script>
    <script src="scripts/controllers/userController.js"></script>
    <script src="scripts/controllers/headerController.js"></script>
    
    <script src="scripts/services/zone.js"></script>
    <script src="scripts/controllers/zoneController.js"></script>

    <script src="scripts/services/category.js"></script>
    <script src="scripts/controllers/categoryController.js"></script>

    <script src="scripts/services/company.js"></script>
    <script src="scripts/controllers/companyController.js"></script>

    <script src="scripts/services/vendor.js"></script>
    <script src="scripts/controllers/vendorController.js"></script>

    <script src="scripts/services/brand.js"></script>
    <script src="scripts/controllers/brandController.js"></script>

    <script src="scripts/services/model_no.js"></script>
    <script src="scripts/controllers/modelNoController.js"></script>

    <script src="scripts/services/cost_centre.js"></script>
    <script src="scripts/controllers/costCentreController.js"></script>

    <script src="scripts/services/department.js"></script>
    <script src="scripts/controllers/departmentController.js"></script>

    <script src="scripts/services/site.js"></script>
    <script src="scripts/controllers/siteController.js"></script>

    <script src="scripts/services/employee.js"></script>
    <script src="scripts/controllers/employeeController.js"></script>

    <script src="scripts/services/inventory.js"></script>
    <script src="scripts/controllers/inventoryController.js"></script>

    <script src="scripts/services/assigned_inventory.js"></script>
    <script src="scripts/controllers/inventoryAssignController.js"></script>

    <script src="scripts/services/transfer_inventory.js"></script>
    <script src="scripts/controllers/inventoryTransferController.js"></script>

    <script src="scripts/services/register_user.js"></script>
    <script src="scripts/controllers/registerController.js"></script>

    <script src="scripts/controllers/dashboardController.js"></script>

    <script src="scripts/services/proc_calc.js"></script>
    <script src="scripts/controllers/procCalController.js"></script>
    
    <script src="scripts/services/item_type.js"></script>
    <script src="scripts/controllers/itemTypeController.js"></script>
    
    <script src="js/app.js"></script>
</html>