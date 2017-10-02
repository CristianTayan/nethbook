<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>FACTURA No. {{$data['comprobante']['numero_factura']}}</title>
    {!! Html::style('css/factura/style.css') !!}
  </head>
  <body>
    <header>
    </header>
    <main>
<div id="container">
        <div class="left">
        <img src="../public/img/logo_fac.png" style="width: 290px;">
        <p>{{$data['comprobante']['empresa']['razon_social']}}</p>
        <p>RUC: {{$data['comprobante']['empresa']['ruc_ci']}}</p>
        <p>Dir Matriz: {{$data['comprobante']['direccion_matriz']}}</p>
        <p>Fecha de Emisión: {{$data['comprobante']['fecha_emicion']}}</p>
        </div> 
        <div style="    width: 50%;   float: right;">
        <p>RUC / CI: {{$data['comprobante']['cliente']['ruc_ci']}}</p>
        <p>Razón Social / Nombres y Apellidos: {{$data['comprobante']['cliente']['nombres_completos']}}</p>
        <p>FACTURA No. {{$data['comprobante']['numero_factura']}}</p>
        <p>FORMA DE PAGO: {{$data['pago']['nombre']}}</p>
        <p>NÚMERO DE AUTORIZACIÓN:</p>
</div> 

  <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
<h1>Detalles</h1>
      <table border="0" cellspacing="0" cellpadding="4" id="tabla_detalles">
        <thead>
          <tr>
            <th>Cod. Princial</th>
            <th >Cant.</th>
            <th >Descripción</th>
            <th >Detalle Adicional</th>
            <th >Precio Unitario</th>
            <th >Descuento</th>
            <th >Precio Total</th>
          </tr>
        </thead>
        <tbody>

         @foreach ($data['detalles'] as $item) 
          <tr>
            <td >{{ $item['nombre_corto'] }}</td>
            <td >{{ $item['cantidad_fac'] }}</td>
            <td >{{ $item['descripcion'] }}</td>
            <td ></td>
            <td >{{ $item['precio'] }}</td>
            <td >0</td>
            <td >{{ $item['total_fac'] }}</td>
          </tr>
        @endforeach

        </tbody>
        <tfoot>
        <tr>
            <td colspan="3"></td>
            <td colspan="3">SUBTOTAL</td>
            <td>{{$data['comprobante']['subtotal']}}</td>
          </tr>
          <tr>
            <td colspan="3"></td>
            <td colspan="3">TARIFA 0</td>
            <td>{{$data['comprobante']['subtotal_sin_iva']}}</td>
          </tr>
          <tr>
            <td colspan="3"></td>
            <td colspan="3">TARIFA 14</td>
            <td>{{$data['comprobante']['subtotal_iva']}}</td>
          </tr>
          <tr>
            <td colspan="3"></td>
            <td colspan="3">IVA 14</td>
            <td>{{$data['comprobante']['valor_iva']}}</td>
          </tr>
          <tr>
            <td colspan="3"></td>
            <td colspan="3">DESCUENTO</td>
            <td>{{$data['comprobante']['descuentos']}}</td>
          </tr>
          <tr>
            <td colspan="3"></td>
            <td colspan="3">TOTAL A PAGAR</td>
            <td>{{$data['comprobante']['total']}}</td>
          </tr>
        </tfoot>
      </table>

  </body>
</html>