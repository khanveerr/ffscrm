<?php 

$item_count = count($data['items']);
$total_pages = ceil($item_count/16);
$display_items = 16;
$cnt_item = 0;
$items = $data['items'];

?>


<?php 
	for ($i=1; $i <= $total_pages; $i++) { 
?>


<p align="centre">Purchase Order <?php echo ($i > 1 ? '(Page '.$i.')' : ''); ?></p>
<table cellspacing="0" cellpadding="0" border="1">
	
	<tr>
		<td>
			<table cellspacing="0" cellpadding="5" border="1" style="border-collapse: collapse;">
				<tr>
					<td>
						Invoice To<br />
						<?php if ($data['site_state_id'] == 2 || $data['site_state_id'] == 4 || $data['site_state_id'] == 5) { ?>
							<strong>SILA Solution Pvt Ltd (Bangalore)</strong><br />
							# 7/1, Myrtel Lane, Ground Floor,<br />
							Richmond, Town , Banglore - 25<br />
							GSTIN/UIN: 29AANCS3675D1ZY<br />
							State Name : , Code :
						<?php } ?>
						<?php if ($data['site_state_id'] == 3) { ?>
							<strong>SILA Solution Pvt Ltd</strong><br />
							Block No-06, 27RGK Papi Reddy Colony<br />
							Chanda Nagar, Serilingapally, Hyderabad<br />
							GSTIN/UIN: 36AANCS3675D1Z3
						<?php } ?>
						<?php if ($data['site_state_id'] == 8) { ?>
							<strong>SILA Solution Pvt Ltd</strong><br />
							B-8, Kailash Bhavan Commercial Complex,<br />
							Wazirpur, Delhi, New Delhi -110052<br />
							Tel. No. 022-67476767/68<br />
							GSTIN/UIN: 07AANCS3675D1Z4
						<?php } ?>
						<?php if ($data['site_state_id'] == 7) { ?>
							<strong>SILA Solution Pvt Ltd</strong><br />
							4th Floor, 404, Solitar Apartment<br />
							Revesla Park, GIDC, Vapi Valsad<br />
							GSTIN/UIN: 24AANCS3675D1Z8
						<?php } ?>
						<?php if ($data['site_state_id'] == 6) { ?>
							<strong>SILA Solution Pvt Ltd</strong><br />
							Jawahar Nagar,Rajbagh, Srinagar<br />
							Jammu And Kashmir, 190008<br />
							GSTIN/UIN: 01AANCS3675D1ZG
						<?php } ?>
						<?php if ($data['site_state_id'] == 1) { ?>
							<strong>Sila Solutions Pvt Ltd</strong><br />
							#1, Gordhan Building<br />
							2nd Floor,Dr. Parekh Street<br />
							Behind Girguam Court,<br />
							Prathna Samaj Mumbai 400 004<br />
							Tel. No. 022-67476767/68<br />
							GSTIN/UIN: 27AANCS3675D1Z2
						<?php } ?>
					</td>
				</tr>
				<tr>
					<td>
						Despatch To<br />
						<strong>{{ $data['site_name'] }}</strong><br />
						{{ $data['site_address'] }}<br />
						<?php 
							if (!empty($data['site_contact_person'])) {
								echo $data['site_contact_person'];
							}
						?>
						-
						<?php 
							if (!empty($data['site_contact_no'])) {
								echo $data['site_contact_no'];
							}
						?><br />
						<?php 
							if (!empty($data['site_state_name'])) {
								echo "State Name: ".$data['site_state_name'].", ";
							}
						?>
						<?php 
							if (!empty($data['site_state_code'])) {
								echo "Code: ".$data['site_state_code'];
							}
						?>
					</td>
				</tr>
				<tr>
					<td>
						Supplier<br />
						<strong>{{ $data['vendor_name'] }}</strong><br />
						{{ $data['vendor_address'] }}<br />
						<?php 
							if (!empty($data['vendor_contact_person'])) {
								echo $data['vendor_contact_person'];
							}
						?>
						-
						<?php 
							if (!empty($data['vendor_contact_no'])) {
								echo $data['vendor_contact_no'];
							}
						?><br />
						<?php 
							if (!empty($data['vendor_state_name'])) {
								echo "State Name: ".$data['vendor_state_name'].", ";
							}
						?>
						<?php 
							if (!empty($data['vendor_state_code'])) {
								echo "Code: ".$data['vendor_state_code'];
							}
						?>
					</td>
				</tr>
			</table>
		</td>
		<td>

			<table cellspacing="0" cellpadding="5" border="1">

				<tr>
					<td>
						Voucher No.<br />
						<strong>{{ $data['voucher_no'] }}</strong>
					</td>
					<td>
						Dated<br />
						<strong>{{ $data['voucher_date'] }}</strong>
					</td>
				</tr>
				<tr>
					<td>
						&nbsp;
					</td>
					<td>
						Mode/Terms of Payment<br />
						<strong>60 Days</strong>
					</td>
				</tr>

				<tr>
					<td>
						Supplier’s Ref./Order No.<br />
						<strong>{{ $data['voucher_no'] }}</strong>
					</td>
					<td>
						Other Reference(s)<br />
						&nbsp;
					</td>
				</tr>

				<tr>
					<td>
						Despatch through<br />
						&nbsp;
					</td>
					<td>
						Destination<br />
						<strong>{{ $data['site_name'] }}</strong>
					</td>
				</tr>
				<tr>
					<td colspan="2">
						Terms of Delivery<br />
						<strong>2-3 Days</strong>
					</td>
				</tr>
				
			</table>
			
		</td>
	</tr>

	<tr>
		<td colspan="2">
			
			<table cellpadding="3" cellspacing="0">

				<tr>
					<td width="5%" style="border-bottom: 1px solid #000000; border-right: 1px solid #000000; font-size: 8px;">Sr. No.</td>
					<td width="60%" style="border-bottom: 1px solid #000000; border-right: 1px solid #000000; font-size: 8px;">Description of Goods</td>
					<td width="9%" style="border-bottom: 1px solid #000000; border-right: 1px solid #000000; font-size: 8px;">Quantity</td>
					<td width="8%" style="border-bottom: 1px solid #000000; border-right: 1px solid #000000; font-size: 8px;">Rate</td>
					<td width="6%" style="border-bottom: 1px solid #000000; border-right: 1px solid #000000; font-size: 8px;">per</td>
					<td width="12%" style="border-bottom: 1px solid #000000;">Amount</td>
				</tr>

						

				

				<?php 
					$start = ($i-1)*$display_items;
					for ($item=$start; $item < $item_count; $item++) { 
				?>
				<?php if($cnt_item < $display_items) { ?>
					<tr>
						<td style="border-right: 1px solid #000000; font-size: 8px;">{{ $items[$item]['sr_no'] }}</td>
						<td style="border-right: 1px solid #000000; font-size: 8px;"><strong>{{ $items[$item]['description'] }}</strong></td>
						<td style="border-right: 1px solid #000000; font-size: 8px;"><strong>{{ round($items[$item]['quantity'],2).' '.$items[$item]['per'] }}</strong></td>
						<td style="border-right: 1px solid #000000; font-size: 8px;">{{ round($items[$item]['rate'],2) }}</td>
						<td style="border-right: 1px solid #000000; font-size: 8px;">{{ $items[$item]['per'] }}</td>
						<td ><strong>{{ round($items[$item]['amount'],2) }}</strong></td>
					</tr>
				<?php 
						$cnt_item++;
					}
				?>
				<?php
					}
				?>


				<?php

					if ($cnt_item == $display_items) {
						$max_count = 26 - ($cnt_item-1);
						$cnt_item = 0;
					} else {
						$max_count = 16 - ($cnt_item-1);
					}

					if ($i <= $total_pages && $max_count > 0) {

						for ($j=1; $j <=$max_count ; $j++) { 
					?>
						
							<tr>
								<td style="border-right: 1px solid #000000;"></td>
								<td style="border-right: 1px solid #000000;"></td>
								<td style="border-right: 1px solid #000000;"></td>
								<td style="border-right: 1px solid #000000;"></td>
								<td style="border-right: 1px solid #000000;"></td>
								<td style="border-right: 1px solid #000000;"></td>
							</tr>

					<?php 
						}

					} 
				?>
				
			</table>

		</td>
	</tr>

	<?php 

		if ($i == $total_pages) {
	?>

	<tr>

		<td colspan="2">
			
			<table cellpadding="3" cellspacing="0">
				
				<tr>
					<td width="5%" style="border-top: 1px solid #000000; border-right: 1px solid #000000; font-size: 8px;">&nbsp;</td>
					<td width="60%" style="border-top: 1px solid #000000; border-right: 1px solid #000000; font-size: 8px;" align="right">Total</td>
					<td width="9%" style="border-top: 1px solid #000000; border-right: 1px solid #000000; font-size: 8px;"><strong>{{ $data['total_quantity'].' Nos.' }}</strong></td>
					<td width="8%" style="border-top: 1px solid #000000; border-right: 1px solid #000000; font-size: 8px;">&nbsp;</td>
					<td width="6%" style="border-top: 1px solid #000000; border-right: 1px solid #000000; font-size: 8px;">&nbsp;</td>
					<td width="12%" style="border-top: 1px solid #000000; font-size: 8px;"><strong>{{ 'Rs. '.$data['total_amount'] }}</strong></td>
				</tr>

			</table>
		</td>
		
	</tr>

	

		<tr>
			<td colspan="2">
				<table cellpadding="5" cellspacing="0">

					<tr>
						<td width="80%">
							<span style="font-size: 8px;">Amount Chargeable (in words)</span><br />
							<strong style="font-size: 9px;">{{ $data['total_amount_words'] }}</strong>
						</td>
						<td align="right" width="20%">
							E. &amp; O.E
						</td>
					</tr>

					<tr>
						<td colspan="2">&nbsp;</td>
					</tr>

					<tr>
						<td colspan="2">

							<table cellspacing="0" cellpadding="0">
								
								<tr>
									
									<td width="50%" style="font-size: 8px;">
										Remarks<br />
										{{ $data['site_name'] }} {{ $data['month_name'] }} {{ $data['year_name'] }}, Made By {{ $data['approved_by'] }}
									</td>
									<td width="50%" style="font-size: 8px; text-align: right; border-left: 1px solid #000000; border-top: 1px solid #000000;">
										for SILA Solution Pvt Ltd (Bangalore)<br /><br /><br />
										Authorised Signatory
									</td>

								</tr>

							</table>
							
						</td>
					</tr>
					
				</table>
			</td>
		</tr>


	<?php

		}

	?>


</table>

<?php	
	} 
?>

