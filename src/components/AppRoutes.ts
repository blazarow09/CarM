export class AppRoutes {
    static loginRoute = '/login';
    static registerRoute = '/register';

    static prefixMyRoute = '/my';

    static homeRoute = AppRoutes.prefixMyRoute + '/home'

    static vehicleScreenRoute = AppRoutes.prefixMyRoute + '/vehicle'

    static repairScreenRoute = AppRoutes.prefixMyRoute + '/repairs'

    static refuelScreenRoute = AppRoutes.prefixMyRoute + '/refuels'

    static moreOptionsRoute = AppRoutes.prefixMyRoute + '/more-options'
}