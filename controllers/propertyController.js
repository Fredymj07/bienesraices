

const admin = (req, res) => {
    res.render('property/admin', {
        page: 'Mis propiedades',
        header: true
    });
}

const create = (req, res) => {
    res.render('property/create', {
        page: 'Crear propiedad',
        header: true
    });
} 

export {
    admin,
    create
}