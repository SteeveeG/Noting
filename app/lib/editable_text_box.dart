import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:async';

class EditableTextBox extends StatefulWidget {
  final String initialText;
  final TextStyle? textStyle;
  final Color? borderColor;
  final EdgeInsets? padding;
  final double? minWidth;
  final double? minHeight;
  final ValueChanged<String>? onTextChanged;
  final VoidCallback? onEditingComplete;

  const EditableTextBox({
    Key? key,
    this.initialText = 'Montserrat ist diese Font Hier',
    this.textStyle,
    this.borderColor,
    this.padding,
    this.minWidth = 100.0,
    this.minHeight = 30.0,
    this.onTextChanged,
    this.onEditingComplete,
  }) : super(key: key);

  @override
  State<EditableTextBox> createState() => _EditableTextBoxState();
}

class _EditableTextBoxState extends State<EditableTextBox> {
  late TextEditingController _controller;
  late FocusNode _focusNode;
  bool _isEditing = false;
  bool _showResizeBox = false;
  bool _isHovering = false;
  Timer? _clickTimer;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.initialText);
    _focusNode = FocusNode();
    
    _focusNode.addListener(() {
      if (!_focusNode.hasFocus && _isEditing) {
        _exitEditMode();
      }
    });
  }

  @override
  void dispose() {
    _clickTimer?.cancel();
    _controller.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  void _handleSingleTap() {
    if (!_isEditing) {
      _clickTimer = Timer(const Duration(milliseconds: 25), () {
        setState(() {
          _showResizeBox = true;
        });
      });
    }
  }

  void _handleDoubleTap() {
    _clickTimer?.cancel();
    setState(() {
      _isEditing = true;
      _showResizeBox = true;
    });
    
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _focusNode.requestFocus();
      _controller.selection = TextSelection(
        baseOffset: 0,
        extentOffset: _controller.text.length,
      );
    });
  }

  void _exitEditMode() {
    setState(() {
      _isEditing = false;
      _showResizeBox = false;
    });
    widget.onEditingComplete?.call();
  }

  void _handleClickOutside() {
    if (_isEditing || _showResizeBox) {
      _exitEditMode();
    }
  }

  @override
  Widget build(BuildContext context) {
    final effectiveTextStyle = widget.textStyle ?? 
      const TextStyle(
        fontFamily: 'Montserrat',
        fontSize: 20.0,
        height: 1.4,
        color: Colors.black,
      );

    return GestureDetector(
      onTap: _handleSingleTap,
      onDoubleTap: _handleDoubleTap,
      child: MouseRegion(
        onEnter: (_) => setState(() => _isHovering = true),
        onExit: (_) => setState(() => _isHovering = false),
        child: Container(
          constraints: BoxConstraints(
            minWidth: widget.minWidth ?? 100.0,
            minHeight: widget.minHeight ?? 30.0,
          ),
          padding: widget.padding ?? const EdgeInsets.all(4.0),
          decoration: BoxDecoration(
            border: _showResizeBox
                ? Border.all(
                    color: widget.borderColor ?? const Color(0xFF3B82F6),
                    width: 1.0,
                  )
                : null,
          ),
          child: _buildTextField(effectiveTextStyle),
        ),
      ),
    );
  }

  Widget _buildTextField(TextStyle textStyle) {
    return TextField(
      controller: _controller,
      focusNode: _focusNode,
      readOnly: !_isEditing,
      maxLines: null,
      minLines: 1,
      scrollPhysics: const NeverScrollableScrollPhysics(),
      decoration: InputDecoration(
        border: InputBorder.none,
        focusedBorder: InputBorder.none,
        enabledBorder: InputBorder.none,
        disabledBorder: InputBorder.none,
        contentPadding: EdgeInsets.zero,
        isDense: true,
      ),
      style: textStyle.copyWith(
        decoration: (!_isEditing && _isHovering)
            ? TextDecoration.underline
            : TextDecoration.none,
      ),
      cursorColor: Colors.black,
      onChanged: widget.onTextChanged,
      onTap: () {
        if (_isEditing) {
          return;
        }
      },
      onSubmitted: (_) => _exitEditMode(),
    );
  }
}

class EditableTextBoxWrapper extends StatelessWidget {
  final Widget child;

  const EditableTextBoxWrapper({
    Key? key,
    required this.child,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        FocusScope.of(context).unfocus();
      },
      behavior: HitTestBehavior.translucent,
      child: child,
    );
  }
}