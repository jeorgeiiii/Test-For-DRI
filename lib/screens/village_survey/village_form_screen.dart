import 'package:flutter/material.dart';
import 'population_form_screen.dart';

class VillageFormScreen extends StatefulWidget {
  @override
  _VillageFormScreenState createState() => _VillageFormScreenState();
}

class _VillageFormScreenState extends State<VillageFormScreen> {
  final _formKey = GlobalKey<FormState>();
  
  // Form fields
  String _villageName = '';
  String _villageCode = '';
  String _gpsLink = '';
  String _selectedState = '';
  String _selectedDistrict = '';
  String _block = '';
  String _panchayat = '';
  String _tehsil = '';
  String _ldgCode = '';
  
  // State data for cascading dropdowns
  final Map<String, List<String>> _stateDistrictData = {
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik'],
    'Uttar Pradesh': ['Lucknow', 'Varanasi', 'Agra', 'Kanpur', 'Prayagraj'],
    'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem'],
  };

  List<String> _availableDistricts = [];

  @override
  void initState() {
    super.initState();
    _availableDistricts = [];
  }

  void _onStateChanged(String? newValue) {
    setState(() {
      _selectedState = newValue ?? '';
      _selectedDistrict = '';
      
      if (_selectedState.isNotEmpty) {
        _availableDistricts = _stateDistrictData[_selectedState] ?? [];
      } else {
        _availableDistricts = [];
      }
    });
  }

  void _onDistrictChanged(String? newValue) {
    setState(() {
      _selectedDistrict = newValue ?? '';
    });
  }

  void _submitForm() {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      
      // Show success dialog
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Row(
            children: [
              Icon(Icons.check_circle, color: Colors.green),
              SizedBox(width: 10),
              Text('Village Data Saved'),
            ],
          ),
          content: Text('Village information has been saved successfully. Continue to population data?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text('Edit'),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => PopulationFormScreen()),
                );
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Village data saved!'),
                    backgroundColor: Colors.green,
                  ),
                );
              },
              style: ElevatedButton.styleFrom(backgroundColor: Color(0xFF800080)),
              child: Text('Continue to Population'),
            ),
          ],
        ),
      );
    }
  }

  void _resetForm() {
    _formKey.currentState?.reset();
    setState(() {
      _villageName = '';
      _villageCode = '';
      _gpsLink = '';
      _selectedState = '';
      _selectedDistrict = '';
      _block = '';
      _panchayat = '';
      _tehsil = '';
      _ldgCode = '';
      _availableDistricts = [];
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFF5F5F5),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Government of India Header
            Container(
              width: double.infinity,
              height: 120,
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.3),
                    blurRadius: 5,
                    offset: Offset(0, 2),
                  ),
                ],
              ),
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Government of India Text
                    Text(
                      'Government of India',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF003366),
                        letterSpacing: 1.5,
                      ),
                    ),
                    SizedBox(height: 8),
                    // Digital India Text
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'Digital India',
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFFFF9933),
                          ),
                        ),
                        SizedBox(width: 10),
                        Text(
                          'Power To Empower',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w500,
                            color: Color(0xFF138808),
                            fontStyle: FontStyle.italic,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            
            // Main Form Container
            Container(
              padding: EdgeInsets.all(20),
              decoration: BoxDecoration(
                image: DecorationImage(
                  image: AssetImage('assets/images/indian_background.jpg'),
                  fit: BoxFit.cover,
                  colorFilter: ColorFilter.mode(
                    Colors.white.withOpacity(0.1),
                    BlendMode.dstATop,
                  ),
                ),
              ),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Form Header Card
                    Card(
                      elevation: 4,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                        side: BorderSide(color: Colors.grey.shade200, width: 1),
                      ),
                      color: Colors.white,
                      child: Padding(
                        padding: EdgeInsets.all(20),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Icon(Icons.location_city, color: Color(0xFF800080), size: 32),
                                SizedBox(width: 12),
                                Text(
                                  'Village Information Form',
                                  style: TextStyle(
                                    fontSize: 24,
                                    fontWeight: FontWeight.w700,
                                    color: Color(0xFF800080),
                                  ),
                                ),
                              ],
                            ),
                            SizedBox(height: 10),
                            Text(
                              'Step 1: Please fill all the details about the village',
                              style: TextStyle(
                                color: Colors.grey.shade600,
                                fontSize: 15,
                              ),
                            ),
                            SizedBox(height: 5),
                            Container(
                              height: 4,
                              width: 100,
                              decoration: BoxDecoration(
                                color: Color(0xFF800080),
                                borderRadius: BorderRadius.circular(2),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    
                    SizedBox(height: 25),
                    
                    // Village Name
                    _buildQuestionWithBackground(
                      question: '🏡 Name of village *',
                      child: _buildTextField(
                        label: 'Enter village name',
                        icon: Icons.location_city,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter village name';
                          }
                          return null;
                        },
                        onSaved: (value) => _villageName = value ?? '',
                      ),
                    ),
                    
                    SizedBox(height: 20),
                    
                    // Village Code Number
                    _buildQuestionWithBackground(
                      question: '🔢 Village Code Number *',
                      child: _buildNumberField(
                        label: 'Enter village code',
                        icon: Icons.numbers,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter village code';
                          }
                          if (!RegExp(r'^[0-9]+$').hasMatch(value)) {
                            return 'Please enter numbers only';
                          }
                          return null;
                        },
                        onSaved: (value) => _villageCode = value ?? '',
                      ),
                    ),
                    
                    SizedBox(height: 20),
                    
                    // GPS Link
                    _buildQuestionWithBackground(
                      question: '📍 GPS Location Link',
                      child: _buildTextField(
                        label: 'https://maps.google.com/?q=latitude,longitude',
                        icon: Icons.map,
                        keyboardType: TextInputType.url,
                        validator: (value) {
                          if (value != null && value.isNotEmpty) {
                            if (!value.startsWith('http')) {
                              return 'Please enter a valid URL';
                            }
                          }
                          return null;
                        },
                        onSaved: (value) => _gpsLink = value ?? '',
                      ),
                    ),
                    
                    SizedBox(height: 20),
                    
                    // State Dropdown
                    _buildQuestionWithBackground(
                      question: '🏳️ State *',
                      child: _buildDropdownField(
                        label: 'Select State',
                        icon: Icons.flag,
                        value: _selectedState,
                        items: _stateDistrictData.keys.toList(),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please select state';
                          }
                          return null;
                        },
                        onChanged: _onStateChanged,
                      ),
                    ),
                    
                    SizedBox(height: 20),
                    
                    // District Dropdown
                    _buildQuestionWithBackground(
                      question: '🏙️ District *',
                      child: _buildDropdownField(
                        label: _selectedState.isEmpty ? 'Select state first' : 'Select District',
                        icon: Icons.location_city,
                        value: _selectedDistrict,
                        items: _availableDistricts,
                        enabled: _selectedState.isNotEmpty,
                        validator: (value) {
                          if (_selectedState.isNotEmpty && (value == null || value.isEmpty)) {
                            return 'Please select district';
                          }
                          return null;
                        },
                        onChanged: _onDistrictChanged,
                      ),
                    ),
                    
                    SizedBox(height: 20),
                    
                    // Block
                    _buildQuestionWithBackground(
                      question: '📦 Block *',
                      child: _buildTextField(
                        label: 'Enter block name',
                        icon: Icons.grid_view,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter block name';
                          }
                          return null;
                        },
                        onSaved: (value) => _block = value ?? '',
                      ),
                    ),
                    
                    SizedBox(height: 20),
                    
                    // Panchayat
                    _buildQuestionWithBackground(
                      question: '🏛️ Panchayat *',
                      child: _buildTextField(
                        label: 'Enter panchayat name',
                        icon: Icons.account_balance,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter panchayat name';
                          }
                          return null;
                        },
                        onSaved: (value) => _panchayat = value ?? '',
                      ),
                    ),
                    
                    SizedBox(height: 20),
                    
                    // Tehsil
                    _buildQuestionWithBackground(
                      question: '🗺️ Tehsil *',
                      child: _buildTextField(
                        label: 'Enter tehsil name',
                        icon: Icons.terrain,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter tehsil name';
                          }
                          return null;
                        },
                        onSaved: (value) => _tehsil = value ?? '',
                      ),
                    ),
                    
                    SizedBox(height: 20),
                    
                    // LDG Code
                    _buildQuestionWithBackground(
                      question: '🏢 LDG Code *',
                      child: _buildNumberField(
                        label: 'Enter LDG code',
                        icon: Icons.code,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter LDG code';
                          }
                          if (!RegExp(r'^[0-9]+$').hasMatch(value)) {
                            return 'Please enter numbers only';
                          }
                          return null;
                        },
                        onSaved: (value) => _ldgCode = value ?? '',
                      ),
                    ),
                    
                    SizedBox(height: 30),
                    
                    // Action Buttons
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: _resetForm,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.grey.shade700,
                              padding: EdgeInsets.symmetric(vertical: 16),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                            ),
                            icon: Icon(Icons.refresh),
                            label: Text('Reset Form'),
                          ),
                        ),
                        SizedBox(width: 15),
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: _submitForm,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Color(0xFF800080),
                              padding: EdgeInsets.symmetric(vertical: 16),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                            ),
                            icon: Icon(Icons.arrow_forward, size: 24),
                            label: Text(
                              'Save & Continue',
                              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                            ),
                          ),
                        ),
                      ],
                    ),
                    
                    SizedBox(height: 20),
                    
                    // Form Preview
                    if (_villageName.isNotEmpty || _selectedState.isNotEmpty)
                      _buildFormPreview(),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Widget for question with background image
  Widget _buildQuestionWithBackground({
    required String question,
    required Widget child,
    String? description,
  }) {
    return Container(
      padding: EdgeInsets.all(15),
      margin: EdgeInsets.only(bottom: 20),
      decoration: BoxDecoration(
        color: Color.fromARGB(30, 128, 0, 128),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: Color(0xFF800080).withOpacity(0.3),
          width: 1,
        ),
        image: DecorationImage(
          image: AssetImage('assets/images/form_background.png'),
          fit: BoxFit.cover,
          opacity: 0.05,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Question Text with Purple Padding
          Container(
            padding: EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Color(0xFF800080),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  question,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
                if (description != null)
                  Padding(
                    padding: EdgeInsets.only(top: 5),
                    child: Text(
                      description,
                      style: TextStyle(
                        fontSize: 13,
                        color: Colors.white.withOpacity(0.9),
                      ),
                    ),
                  ),
              ],
            ),
          ),
          SizedBox(height: 15),
          // Input Field
          child,
        ],
      ),
    );
  }

  // Form Preview Card
  Widget _buildFormPreview() {
    return Card(
      elevation: 2,
      color: Colors.purple.shade50,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10),
        side: BorderSide(color: Colors.purple.shade200, width: 1),
      ),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.preview, color: Color(0xFF800080)),
                SizedBox(width: 8),
                Text(
                  '📋 Form Preview:',
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF800080),
                    fontSize: 16,
                  ),
                ),
              ],
            ),
            SizedBox(height: 10),
            if (_villageName.isNotEmpty)
              _buildPreviewItem('Village:', _villageName),
            if (_selectedState.isNotEmpty)
              _buildPreviewItem('State:', _selectedState),
            if (_selectedDistrict.isNotEmpty)
              _buildPreviewItem('District:', _selectedDistrict),
            if (_block.isNotEmpty)
              _buildPreviewItem('Block:', _block),
            if (_panchayat.isNotEmpty)
              _buildPreviewItem('Panchayat:', _panchayat),
          ],
        ),
      ),
    );
  }

  Widget _buildPreviewItem(String label, String value) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              label,
              style: TextStyle(
                fontWeight: FontWeight.w500,
                color: Colors.grey.shade700,
              ),
            ),
          ),
          SizedBox(width: 10),
          Expanded(
            child: Text(
              value,
              style: TextStyle(
                fontWeight: FontWeight.w600,
                color: Color(0xFF800080),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Text Field Widget
  Widget _buildTextField({
    required String label,
    required IconData icon,
    required FormFieldValidator<String?> validator,
    required FormFieldSetter<String?> onSaved,
    TextInputType keyboardType = TextInputType.text,
  }) {
    return TextFormField(
      decoration: InputDecoration(
        labelText: label,
        labelStyle: TextStyle(color: Colors.grey.shade600),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: Colors.grey.shade300),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: Color(0xFF800080), width: 2),
        ),
        filled: true,
        fillColor: Colors.white,
        contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        prefixIcon: Icon(icon, color: Color(0xFF800080)),
      ),
      keyboardType: keyboardType,
      validator: validator,
      onSaved: onSaved,
      style: TextStyle(color: Colors.grey.shade800),
    );
  }

  // Number Field Widget
  Widget _buildNumberField({
    required String label,
    required IconData icon,
    required FormFieldValidator<String?> validator,
    required FormFieldSetter<String?> onSaved,
  }) {
    return TextFormField(
      decoration: InputDecoration(
        labelText: label,
        labelStyle: TextStyle(color: Colors.grey.shade600),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: Colors.grey.shade300),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: Color(0xFF800080), width: 2),
        ),
        filled: true,
        fillColor: Colors.white,
        contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        prefixIcon: Icon(icon, color: Color(0xFF800080)),
      ),
      keyboardType: TextInputType.number,
      validator: validator,
      onSaved: onSaved,
      style: TextStyle(color: Colors.grey.shade800),
    );
  }

  // Dropdown Field Widget
  Widget _buildDropdownField({
    required String label,
    required IconData icon,
    required String value,
    required List<String> items,
    required FormFieldValidator<String?> validator,
    required Function(String?) onChanged,
    bool enabled = true,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: enabled ? Colors.grey.shade300 : Colors.grey.shade200,
        ),
      ),
      child: DropdownButtonFormField<String>(
        value: value.isEmpty ? null : value,
        decoration: InputDecoration(
          labelText: label,
          labelStyle: TextStyle(
            color: enabled ? Colors.grey.shade600 : Colors.grey.shade400,
          ),
          border: InputBorder.none,
          contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        ),
        items: items.map((String item) {
          return DropdownMenuItem<String>(
            value: item,
            child: Text(
              item,
              style: TextStyle(
                color: enabled ? Colors.grey.shade800 : Colors.grey.shade400,
              ),
            ),
          );
        }).toList(),
        onChanged: enabled ? onChanged : null,
        validator: validator,
        isExpanded: true,
        icon: Icon(Icons.arrow_drop_down, color: Color(0xFF800080)),
        style: TextStyle(color: Colors.grey.shade800),
        dropdownColor: Colors.white,
      ),
    );
  }
}