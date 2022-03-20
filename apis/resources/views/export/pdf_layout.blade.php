<table border="1" cellpadding="5" cellspacing="0" width="100%">
	
	

	<?php 

		$colspan = 4;
		$desc_width = 75;

		if($show_hide_column['is_image'] == 1) {
			$desc_width = $desc_width-10;
			$colspan++;
		}

		if($show_hide_column['is_hsn_code'] == 1) {
			$desc_width = $desc_width-10;
			$colspan++;
		}

		if($show_hide_column['is_brand'] == 1) {
			$desc_width = $desc_width-10;
			$colspan++;
		}

		if($show_hide_column['is_unit'] == 1) {
			$desc_width = $desc_width-7;
			$colspan++;
		}

		if($show_hide_column['is_mrp'] == 1) {
			$desc_width = $desc_width-10;
			$colspan++;
		}

	?>

	<tr>
		<td colspan="<?php echo $colspan; ?>" align="center">
			<img src="{{ public_path() }}/images/logo.png" width="70" />
		</td>
	</tr>

	<tr>
		<td colspan="<?php echo $colspan; ?>">
			
			<span style="font-weight: bold; font-size: 11px;">Company: </span> <span style="font-size: 11px;">{{ $proc_calc->company_name }}</span><br />
			<span style="font-weight: bold; font-size: 11px;">Financial Year: </span> <span style="font-size: 11px;">{{ $proc_calc->financial_year }}</span><br />
			<span style="font-weight: bold; font-size: 11px;">Type: </span> <span style="font-size: 11px;">{{ $proc_calc->type }}</span><br />
			<span style="font-weight: bold; font-size: 11px;">Site: </span> <span style="font-size: 11px;">{{ $proc_calc->site_name }}</span>

		</td>
	</tr>

	<tr>
		<th style="background-color: #f6a602; text-align: center; vertical-align: middle; font-weight: bold; font-size: 8px; vertical-align: middle;" width="5%" valign="middle">Sr. No.</th>
		<?php if($show_hide_column['is_image'] == 1) { ?>
		<th style="background-color: #f6a602; text-align: center; vertical-align: middle; font-weight: bold; font-size: 8px; vertical-align: middle;" width="10%" valign="middle">Image</th>
		<?php } ?>
		<th style="background-color: #f6a602; text-align: center; vertical-align: middle; font-weight: bold; font-size: 8px; vertical-align: middle;" width="<?php echo $desc_width; ?>%" valign="middle">Item Description</th>
		<?php if($show_hide_column['is_hsn_code'] == 1) { ?>
		<th style="background-color: #f6a602; text-align: center; vertical-align: middle; font-weight: bold; font-size: 8px; vertical-align: middle;" width="10%" valign="middle">HSN Code</th>
		<?php } ?>
		<?php if($show_hide_column['is_brand'] == 1) { ?>
		<th style="background-color: #f6a602; text-align: center; vertical-align: middle; font-weight: bold; font-size: 8px; vertical-align: middle;" width="10%" valign="middle">Brand</th>
		<?php } ?>
		<?php if($show_hide_column['is_unit'] == 1) { ?>
		<th style="background-color: #f6a602; text-align: center; vertical-align: middle; font-weight: bold; font-size: 8px; vertical-align: middle;" width="7%" valign="middle">Unit</th>
		<?php } ?>
		<?php if($show_hide_column['is_mrp'] == 1) { ?>
		<th style="background-color: #f6a602; text-align: center; vertical-align: middle; font-weight: bold; font-size: 8px; vertical-align: middle;" width="10%" valign="middle" valign="middle" valign="middle">MRP<br />(If Any)</th>
		<?php } ?>
		<th style="background-color: #f6a602; text-align: center; vertical-align: middle; font-weight: bold; font-size: 8px; vertical-align: middle;" width="10%" valign="middle" valign="middle">Pre GST Rate<br />(In. Rs.)</th>
		<th style="background-color: #f6a602; text-align: center; vertical-align: middle; font-weight: bold; font-size: 8px; vertical-align: middle;" width="10%" valign="middle">GST %</th>
	</tr>


	<?php $i=1; ?>

	@foreach($items as $item)
	<tr>
		
		<td style="text-align: center; vertical-align: middle; font-size: 7px;" valign="middle">{{ $i++ }}</td>
		<?php if($show_hide_column['is_image'] == 1) { ?>
			<td style="text-align: center; vertical-align: middle; font-size: 7px;"><img src="{{ public_path() }}/uploads/images/{{ $item->image_file }}" width="150" /></td>
		<?php } ?>
		<td style="text-align: center; vertical-align: middle; font-size: 7px;" valign="middle" valign="middle">{{ $item->description }}</td>
		<?php if($show_hide_column['is_hsn_code'] == 1) { ?>
			<td style="text-align: center; vertical-align: middle; font-size: 7px;" valign="middle">{{ $item->hsn_code }}</td>
		<?php } ?>
		<?php if($show_hide_column['is_brand'] == 1) { ?>
			<td style="text-align: center; vertical-align: middle; font-size: 7px;" valign="middle">{{ $item->brand }}</td>
		<?php } ?>
		<?php if($show_hide_column['is_unit'] == 1) { ?>
			<td style="text-align: center; vertical-align: middle; font-size: 7px;" valign="middle">{{ $item->unit }}</td>
		<?php } ?>
		<?php if($show_hide_column['is_mrp'] == 1) { ?>
			<td style="text-align: center; vertical-align: middle; font-size: 7px;" valign="middle">{{ $item->mrp }}</td>
		<?php } ?>
		<td style="text-align: center; vertical-align: middle; font-size: 7px;" valign="middle">{{ $item->selling_price }}</td>
		<td style="text-align: center; vertical-align: middle; font-size: 7px;" valign="middle">{{ $item->gst_perc }}</td>
		
	</tr>

	@endforeach

</table>