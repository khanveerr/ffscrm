<table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" height="100%" style="font-family: Arial;margin:0;background-color:#e5e5e5;width:100%;height:100%">
  <tbody><tr>
  <td class="m_-8303779252950666877m_-81614967863654680base" style="color:#313a44;text-align:center;padding:30px 0">
  <div class="m_-8303779252950666877m_-81614967863654680container" style="margin:0 auto;width:100%;max-width:600px;border-radius:8px">
  <table border="0" cellpadding="0" cellspacing="0" align="center" style="width:100%;max-width:900px;border-radius:8px;margin:0">
  <tbody><tr>
  <td align="center">
  <div class="m_-8303779252950666877m_-81614967863654680card" style="width:100%;background-color:#ffffff;margin:0;padding:20px 0 30px;border-radius:8px">
  <table class="m_-8303779252950666877m_-81614967863654680header" style="width:90%;max-width:600px;font-size:16px;margin:0">
  <tbody><tr>
  <td style="vertical-align:top;line-height:24px;font-weight:500;text-align:left;padding:0 0 10px">
  <a href="https://silagroup.co.in" style="color:#8597ff;text-decoration:none" target="_blank">
  <img style="height:38px" src="https://silagroup.co.in/dist/img/logo.png">
  </a></td></tr>
  </tbody></table>
  <div class="m_-8303779252950666877m_-81614967863654680divider m_-8303779252950666877m_-81614967863654680content" style="width:90%;max-width:600px;border-bottom:1px solid #313a44;text-transform:uppercase;font-size:13px;letter-spacing:1px;font-weight:500"></div>
  <table class="m_-8303779252950666877m_-81614967863654680content" style="width:90%;max-width:600px;font-size:13px;letter-spacing:1px;font-weight:500">
  <tbody><tr>
  <td style="padding-top:10px;vertical-align:top;line-height:24px;font-weight:normal;text-align:left">
  	Hi Team,<br /><br />
  	<b>Site Activated Details:</b><br />
    Site Name: {{ $data['site_name'] }}<br />
    Site Start Date: {{ $data['site_start_date'] }}<br />
    State: {{ $data['state'] }}<br />
    City: {{ $data['city'] }}<br />
    Pin Code: {{ $data['pincode'] }}<br />
    GST Status: {{ $data['gst_status'] }}<br />
    GST Number (If Not Applicable or Exempted, write NA): {{ $data['gst_number'] }}<br />
    Enter Full Address: {{ $data['address'] }}<br />
    BD - SPOC: {{ $data['bd_spoc'] }}<br />
    Site In-charge: {{ $data['site_incharge'] }}<br />
    Sector: {{ $data['sector'] }}<br />
    Billing Name: {{ $data['billing_name'] }}<br />
    Billing Period: {{ $data['billing_period'] }}<br />
    Billing Date: {{ $data['billing_date'] }}<br />
    Billing To Address: {{ $data['billing_to_address'] }}<br />
    Consignee Address: {{ $data['consignee_address'] }}<br />
    Address to be displayed on Invoice: {{ $data['invoice_address'] }}<br />
  	Client - SPOC Name: {{ $data['client_spoc_name'] }}<br />
  	Client - SPOC Contact Number: {{ $data['client_spoc_contact'] }}<br />
  	Client - SPOC Email ID: {{ $data['client_spoc_email'] }}<br />
    Work Order/Agreement: {{ $data['is_work_order_signed'] == '1' || $data['is_work_order_signed'] == 1 ? 'Signed' : 'Not Signed' }}<br /><br />
	Thank you!
  </td></tr>
  </tbody></table>
  </div>
  </td>
  </tr>
  </tbody></table>
  </div>
  </td>
  </tr>
  </tbody></table>
