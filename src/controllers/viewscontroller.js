const viewController = {};

viewController.index = (req, res) => {
    const title = 'Genera una cotización';
    res.status(200).render('index',{title:title});
}

viewController.search = (req, res) => {
    res.status(200).render('search');
}


module.exports = viewController;