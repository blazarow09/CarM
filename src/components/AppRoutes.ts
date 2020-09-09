export class AppRoutes {
    static prefixMyRoute = '/my';
    static homeRoute = AppRoutes.prefixMyRoute + '/home';

    // Auth
    static loginRoute = '/login';
    static registerRoute = '/register';

    // Vehicle
    static vehicleScreenRoute = AppRoutes.prefixMyRoute + '/vehicle';

    // Refuel
    static refuelScreenRoute = AppRoutes.prefixMyRoute + '/refuels';
    static viewRefuelScreenRoute = AppRoutes.prefixMyRoute + '/refuel/details';

    // Repair
    static repairScreenRoute = AppRoutes.prefixMyRoute + '/repairs';
    static viewRepairScreenRoute = AppRoutes.prefixMyRoute + '/repair/details';

    // Others
    static moreOptionsRoute = AppRoutes.prefixMyRoute + '/more-options';
    static settingsRoute = AppRoutes.prefixMyRoute + '/settings';
}
