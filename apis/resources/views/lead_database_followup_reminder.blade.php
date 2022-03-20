@foreach($leads as $lkey => $lvalue)
	
	<table width="600" style="border-collapse: collapse; margin-bottom: 40px;">

		<tr>
			<td style="border-top: 2px solid #000000; border-bottom: 2px solid #000000; padding: 5px; font-weight: normal;font-family: 'Trebuchet MS'; background-color: #CCCCCC;">
				<h2 style="font-family: 'Trebuchet MS'; margin-bottom: 0px; margin-top: 0px;">Lead Database Followup - {{ $lvalue['full_month_year'] }}</h4>		
			</td>
		</tr>

		<tr>
			<td style="padding: 5px; padding-top: 20px; font-weight: normal;font-family: 'Trebuchet MS';">

				@if(array_key_exists('data', $lvalue))

					@foreach($lvalue['data'] as $kkey => $kvalue)

						<h3 style="margin: 0px; margin-bottom: 5px;font-family: 'Trebuchet MS';">{{ $kkey }}</h3>

						<table width="600"  border="1" style="border-collapse: collapse; margin-bottom: 40px;">
							<tr>
								<th style="border: 1px solid #000000; padding: 5px;font-family: 'Trebuchet MS';">#</th>
								<th style="border: 1px solid #000000; padding: 5px;font-family: 'Trebuchet MS'; text-align: left;">Company</th>
								<th style="border: 1px solid #000000; padding: 5px;font-family: 'Trebuchet MS'; text-align: left;">Next Followup Date</th>
							</tr>
								<?php $i=1; ?>
								@foreach($kvalue as $akey => $avalue)
								<tr>
									<td style="border: 1px solid #000000; padding: 5px; font-weight: normal;font-family: 'Trebuchet MS';"><?php echo $i++; ?></td>
									<td style="border: 1px solid #000000; padding: 5px; font-weight: normal;font-family: 'Trebuchet MS';">{{ $avalue->company_name }}</td>
									<td style="border: 1px solid #000000; padding: 5px; font-weight: normal;font-family: 'Trebuchet MS';">{{ $avalue->next_follow_up_date_str }}</td>
								</tr>
								@endforeach		
						</table>

					@endforeach

				@endif
			</td>
		</tr>

	</table>

@endforeach

