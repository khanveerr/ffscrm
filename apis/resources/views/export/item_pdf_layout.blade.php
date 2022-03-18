<table border="1" cellpadding="5" cellspacing="0" width="100%">
	


	<tr>
		<td colspan="5" align="center">
			<img src="{{ public_path() }}/images/logo.png" width="70" />
		</td>
	</tr>

	<tr>
		<td colspan="5">
			
			<span style="font-weight: bold; font-size: 11px;">Site: </span> <span style="font-size: 11px;">{{ $site_name }}</span>

		</td>
	</tr>

	<tr>
		<th style="background-color: #f6a602; text-align: center; vertical-align: middle; font-weight: bold; font-size: 8px; vertical-align: middle;" valign="middle">Sr. No.</th>
		<th style="background-color: #f6a602; text-align: center; vertical-align: middle; font-weight: bold; font-size: 8px; vertical-align: middle;" valign="middle">Item</th>
		<th style="background-color: #f6a602; text-align: center; vertical-align: middle; font-weight: bold; font-size: 8px; vertical-align: middle;" valign="middle">Quantity</th>
		<th style="background-color: #f6a602; text-align: center; vertical-align: middle; font-weight: bold; font-size: 8px; vertical-align: middle;" valign="middle">Price</th>
		<th style="background-color: #f6a602; text-align: center; vertical-align: middle; font-weight: bold; font-size: 8px; vertical-align: middle;" valign="middle">Total</th>
	</tr>


	<?php $i=1; ?>

	@foreach($items as $item)
	<tr>
		<td style="text-align: center; vertical-align: middle; font-size: 7px;" valign="middle"><?php echo $i; ?></td>
		<td style="text-align: center; vertical-align: middle; font-size: 7px;" valign="middle">{{ $item->description }}</td>
		<td style="text-align: center; vertical-align: middle; font-size: 7px;" valign="middle">{{ $item->quantity }}</td>
		<td style="text-align: center; vertical-align: middle; font-size: 7px;" valign="middle">{{ $item->rate }}</td>
		<td style="text-align: center; vertical-align: middle; font-size: 7px;" valign="middle">{{ $item->pre_gst }}</td>
		<?php $i++; ?>
	</tr>
	@endforeach

	<tr>
		<td>&nbsp;</td>
		<td>&nbsp;</td>
		<td>&nbsp;</td>
		<td><span style="text-align: center; vertical-align: middle; font-weight: bold; font-size: 8px;">Pre GST</span></td>
		<td><span style="text-align: center; vertical-align: middle; font-size: 8px;">{{ $total_pre_gst }}</span></td>
	</tr>

	<tr>
		<td>&nbsp;</td>
		<td>&nbsp;</td>
		<td>&nbsp;</td>
		<td><span style="text-align: center; vertical-align: middle; font-weight: bold; font-size: 8px;">Tax</span></td>
		<td><span style="text-align: center; vertical-align: middle; font-size: 8px;">{{ $tax }}</span></td>
	</tr>

	<tr>
		<td>&nbsp;</td>
		<td>&nbsp;</td>
		<td>&nbsp;</td>
		<td><span style="text-align: center; vertical-align: middle; font-weight: bold; font-size: 8px;">Total</span></td>
		<td><span style="text-align: center; vertical-align: middle; font-size: 8px;">{{ $total }}</span></td>
	</tr>

</table>