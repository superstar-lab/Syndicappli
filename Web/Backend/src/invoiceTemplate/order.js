module.exports = ({ name, address, email, invoice_number, invoice_date, order_id, order_date, product_name, amount_lot, price, date, total }) => {
return `
<!doctype html>
    <html>
       <head>
           <style>
               body {
                    padding-top: 50px !important;
                    padding-right: 10px !important;
               }

               * {
                    font-family: 'Poppins';
               }

               .image {
                   width: 40%;
               }

               h2 {
                   margin-top: 0px !important;
               }
               .row {
                padding-left: 50px !important;
                }
               .row.block {
                margin-top: 50px !important;
               }
               .padding-15 {
                   padding-left: 65px !important;
               }
               th {
                   padding: 8px !important;
               }
               td {
                   padding: 8px !important;
               }
               tbody > tr {
                   border-top: 1px solid #eeeeee;
               }
               .full-table {
                width: 90% !important;
                box-shadow: 0px 3px 5px 2px rgba(182, 172, 251, .42);
                border-radius: 15px;
               }
               .col-md-6 {
               	width: 50%;
               	float: left;
               }
               .blank {
                   height: 600px;
               }
               
            </style>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap" rel="stylesheet">
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
          <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
          <meta charset="utf-8">
          <title>Invoice</title>
       </head>
       <body>
        <div class="row">
            <div class="col-md-6">
                <img class="image" src="https://syndicappli-avatars.s3.amazonaws.com/d47450c763dbd446be7bd802e6d79e29.png">
            </div>
            <div class="col-md-6">
                <h2><b>Syndicappli</b></h2>
                <p>66 avenue des Champs Elysees</p>
                <p>75008 Paris</p>
                <br/>
                <p>Tel : 01 02 03 04 05</p>
                <p>mail : contact@syndicappli.fr</p>
            </div>
        </div>
        <div class="row block">
            <div class="col-md-6">
                <h2><b>FACTURE</b></h2>
                <p>${name}</p>
                <p>${address}</p>
                <p>${email}</p>
            </div>
            <div class="col-md-6">
                <p>Numéro de facture : #${invoice_number}</p>
                <p>Date de la facture : ${invoice_date}</p>
                <p>Numéro de la commande : #${order_id}</p>
                <p>Date de la commende : ${order_date}</p>
                <p>Méthode de paiement : SEPA</p>
            </div>
        </div>
        <div class="row block padding-15">
            <table class="full-table">
                <thead>
                    <tr>
                        <th>Produit</th>
                        <th>Nombre de lots</th>
                        <th>Prix par lot</th>
                        <th>Date</th>
                        <th>Montant</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${product_name}</td>
                        <td>${amount_lot}</td>
                        <td>${price}cts HT</td>
                        <td>${date}</td>
                        <td>${total}€ HT</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <div><img src= "https://syndicappli-avatars.s3.amazonaws.com/55a7f5c761eca713a9e6684324c85c85.png" /></div>
       </body>
    </html>
    `;
};