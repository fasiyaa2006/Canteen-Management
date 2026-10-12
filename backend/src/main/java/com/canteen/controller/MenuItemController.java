package com.canteen.controller;

import com.canteen.dto.MenuItemRequest;
import com.canteen.entity.MenuItem;
import com.canteen.service.MenuItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class MenuItemController {

    private final MenuItemService menuItemService;

    @GetMapping
    public ResponseEntity<List<MenuItem>> getAllMenuItems(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean availableOnly) {
        return ResponseEntity.ok(menuItemService.getAllMenuItems(category, availableOnly));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuItem> getMenuItemById(@PathVariable Long id) {
        return ResponseEntity.ok(menuItemService.getMenuItemById(id));
    }

    @PostMapping
    public ResponseEntity<MenuItem> createMenuItem(@Valid @RequestBody MenuItemRequest request) {
        MenuItem created = menuItemService.createMenuItem(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MenuItem> updateMenuItem(@PathVariable Long id, @Valid @RequestBody MenuItemRequest request) {
        MenuItem updated = menuItemService.updateMenuItem(id, request);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/toggle-availability")
    public ResponseEntity<MenuItem> toggleAvailability(@PathVariable Long id) {
        MenuItem updated = menuItemService.toggleAvailability(id);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable Long id) {
        menuItemService.deleteMenuItem(id);
        return ResponseEntity.noContent().build();
    }
}
