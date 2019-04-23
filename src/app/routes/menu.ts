
const Home = {
    text: 'Inicio',
    link: '/home',
    icon: 'icon-home'
};



const Usuario = {
    text: 'Usuario',
    link: '/user',
    icon: 'icon-user',
    submenu: [
        {
            text: 'crear',
            link: '/user/create',
            roles:['administrador']
        },
        {
            text: 'lista',
            link: '/user/list',
            roles:['administrador']
        }
    ],
    roles:['administrador']
};

const mapa = {
    text:"Mapa",
    link:"/mapa/index",
    icon:"icon-map"
}

const indicador = {
    text: 'Indicadores',
    link: '/indicador',
    icon: 'icon-speedometer',
    submenu: [
        {
            text: 'Ambiental y Geotécnico',
            link: '/indicador/ambiental',
            //roles:['administrador'],
            //icon: 'fa-bar-chart-o'
        },
        {
            text: 'Gestión Social',
            link: '/indicador/gestion',
            //roles:['administrador']
        },
        {
            text: 'Movimiento Poblacional',
            link: '/indicador/control-acceso',
            //roles:['administrador']
        }
    ]/*,
    roles:['administrador']*/
};

const headingMain = {
    text: 'Menú',
    heading: true
};

export const menu = [
    headingMain,   
    mapa,
    indicador,
    Usuario
];
